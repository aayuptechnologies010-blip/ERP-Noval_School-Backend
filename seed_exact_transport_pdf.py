import pymupdf
import pymongo
import os
import re
import sys
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()
print("1. Connecting to MongoDB...", flush=True)
client = pymongo.MongoClient(os.getenv('MONGO_URI'), serverSelectionTimeoutMS=10000)
db = client.get_default_database()
client.admin.command('ping')
print("-> MongoDB Connected Successfully!", flush=True)

def clean_stop_name(st):
    s = re.sub(r'\s+', ' ', str(st)).strip()
    s = s.replace('BAHADURPU R', 'BAHADURPUR')
    s = s.replace('CHAURADEE H', 'CHAURADEEH')
    s = s.replace('MAHARAJGAN J', 'MAHARAJGANJ')
    s = s.replace('10- BARHALGANJ', '10-BARHALGANJ')
    s = s.replace('10- DOHRIGHAT KASBA', '10-DOHRIGHAT KASBA')
    s = s.replace('2- SOHRABHAR', '2-SOHRABHAR')
    s = s.replace('4- RASOOLPUR', '4-RASOOLPUR')
    s = s.replace('4- SAKKARPUR', '4-SAKKARPUR')
    s = s.replace('8- IBRAHIMABAD', '8-IBRAHIMABAD')
    s = s.replace('9- BADHALGANJ BYPASS', '9-BADHALGANJ BYPASS')
    s = s.replace('6- BAHADURPUR', '6-BAHADURPUR')
    s = s.replace('7- BAHADURPUR', '7-BAHADURPUR')
    s = s.replace('3- CHOTKA FARSARAH', '3-CHOTKA FARSARAH')
    s = s.replace('3- CHOTKA FARSARA', '3-CHOTKA FARSARAH')
    return s

pdf_path = r'C:\Users\Admin\Downloads\TRANSPORT REPORT CLASS WISE.pdf'
print(f"2. Opening PDF from {pdf_path}...", flush=True)
doc = pymupdf.open(pdf_path)
records = []

for p_idx in range(24):
    p_main = doc[p_idx]
    p_date = doc[p_idx + 24]
    
    main_rows = []
    for t in p_main.find_tables():
        for r in t.extract():
            if r and r[0] and str(r[0]).strip().isdigit():
                main_rows.append([str(c).strip() if c is not None else '' for c in r])
                
    date_rows = []
    for t in p_date.find_tables():
        for r in t.extract():
            val = str(r[0]).strip() if r and r[0] else ''
            if val and not val.startswith('Academic') and val != 'ASSIGN DATE':
                date_rows.append(val)
                
    for i, r in enumerate(main_rows):
        d_val = date_rows[i] if i < len(date_rows) else ''
        records.append({
            'sn': int(r[0]),
            'admNo': str(r[1]).strip(),
            'name': str(r[2]).strip(),
            'classStr': str(r[3]).strip(),
            'address': str(r[4]).strip().replace('\n', ' '),
            'contact': str(r[5]).strip(),
            'stop': clean_stop_name(r[6]),
            'rawStop': str(r[6]).strip(),
            'fare': int(r[7]) if str(r[7]).isdigit() else 0,
            'agency': str(r[8]).strip() if len(r) > 8 else '',
            'assignDate': d_val
        })

print(f"-> Extracted {len(records)} student records from PDF.", flush=True)

# Cache existing Routes & Vehicles
routes_map = {}
for r in db.vehicleroutes.find():
    routes_map[r.get('routeName').strip().upper()] = r.get('_id')

def get_or_create_route(r_name, stop_name):
    key = r_name.strip().upper()
    if key in routes_map:
        return routes_map[key]
    res = db.vehicleroutes.insert_one({
        'routeName': r_name,
        'startPoint': 'School Campus',
        'endPoint': stop_name,
        'remarks': 'Seeded from Transport Report',
        'createdAt': datetime.now(),
        'updatedAt': datetime.now()
    })
    routes_map[key] = res.inserted_id
    return res.inserted_id

vehicles_map = {}
for v in db.vehicles.find():
    v_no = v.get('vehicleNo', '').strip().upper()
    vehicles_map[v_no] = v.get('_id')

def get_or_create_vehicle(v_name):
    key = v_name.strip().upper()
    if key in vehicles_map:
        return vehicles_map[key]
    res = db.vehicles.insert_one({
        'vehicleNo': v_name,
        'capacity': 40,
        'driverName': 'Assigned Driver',
        'driverMobile': '9999999999',
        'createdAt': datetime.now(),
        'updatedAt': datetime.now()
    })
    vehicles_map[key] = res.inserted_id
    return res.inserted_id

stops_map = {}
for s in db.routestops.find():
    clean_n = clean_stop_name(s.get('stopName', '')).strip().upper()
    stops_map[clean_n] = s

print("3. Ensuring all routes, vehicles, and stops exist...", flush=True)
for rec in records:
    st_name = rec['stop']
    fare = rec['fare']
    st_key = st_name.strip().upper()
    
    m = re.match(r'^(\d+)-', st_name)
    if m:
        r_name = f'Route {m.group(1)}'
        v_name = f'Bus No. {m.group(1)}'
    else:
        r_name = f'Route - {st_name}'
        v_name = 'Bus No. 1'
        
    r_id = get_or_create_route(r_name, st_name)
    v_id = get_or_create_vehicle(v_name)
    
    if st_key not in stops_map:
        res = db.routestops.insert_one({
            'stopName': st_name,
            'route': r_id,
            'stopOrder': 1,
            'distanceFromStart': 5,
            'fee': fare,
            'createdAt': datetime.now(),
            'updatedAt': datetime.now()
        })
        stops_map[st_key] = {'_id': res.inserted_id, 'fee': fare, 'route': r_id}
    else:
        db.routestops.update_one({'_id': stops_map[st_key]['_id']}, {'$set': {'fee': fare}})

print("-> Routes, Vehicles and Stops synchronized!", flush=True)

# 4. Bulk Write Students
print("4. Preparing bulk operations for students update...", flush=True)
operations = []
for rec in records:
    adm = rec['admNo']
    st_name = rec['stop']
    st_key = st_name.strip().upper()
    st_doc = stops_map.get(st_key)
    stop_id = st_doc['_id'] if st_doc else None
    
    m = re.match(r'^(\d+)-', st_name)
    if m:
        r_name = f'Route {m.group(1)}'
        v_name = f'Bus No. {m.group(1)}'
    else:
        r_name = f'Route - {st_name}'
        v_name = 'Bus No. 1'
        
    r_id = routes_map.get(r_name.strip().upper())
    v_id = vehicles_map.get(v_name.strip().upper())
    
    parsed_date = datetime.now()
    if rec['assignDate']:
        try:
            parsed_date = datetime.strptime(rec['assignDate'], '%d-%b-%Y')
        except:
            pass
            
    operations.append(pymongo.UpdateOne(
        {'academicDetails.admissionNumber': adm},
        {
            '$set': {
                'transportAssigned': True,
                'transportFee': rec['fare'],
                'transportRoute': r_name,
                'transportStop': st_name,
                'vehicleNo': v_name,
                'transportDetails.isTransportStudent': True,
                'transportDetails.isSelfTransport': False,
                'transportDetails.route': r_id,
                'transportDetails.stop': stop_id,
                'transportDetails.vehicle': v_id,
                'transportDetails.transportFee': rec['fare'],
                'transportDetails.assignedDate': parsed_date,
                'transportDetails.agencyName': rec['agency'],
                'contactAddress.currentAddress': rec['address'],
                'contactAddress.contactNumber': rec['contact']
            }
        }
    ))

print(f"-> Executing bulk write of {len(operations)} operations...", flush=True)
result = db.students.bulk_write(operations)
print(f"-> Bulk write finished! Matched: {result.matched_count}, Modified: {result.modified_count}", flush=True)

transport_total = db.students.count_documents({'transportDetails.isTransportStudent': True})
print(f"5. Total students in DB with Transport Assigned: {transport_total}", flush=True)
