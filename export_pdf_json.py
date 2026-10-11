import pymupdf
import json
import re

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
            'fare': int(r[7]) if str(r[7]).isdigit() else 0,
            'agency': str(r[8]).strip() if len(r) > 8 else '',
            'assignDate': d_val
        })

print(f"Total extracted: {len(records)}")
with open('transport_pdf_records.json', 'w', encoding='utf-8') as f:
    json.dump(records, f, indent=2, ensure_ascii=False)
print("Saved to transport_pdf_records.json successfully!")
