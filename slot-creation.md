---

# Slot Creation API Documentation

This document contains the cURL commands to test the **Slot Creation** APIs.
The base URL is `http://localhost:5000`.

## 1. Get Total Applicants
**GET** `/api/slot-creations/total-applicants`

Use this API when the user clicks the "Show" button. It returns the total number of applicants from `ProspectusEntry` that match the class, session, and date.

_Query params (Required):_
- `session=SESSION_ID`
- `studentClass=CLASS_ID`
- `tillDate=YYYY-MM-DD`

```bash
curl -X GET "http://localhost:5000/api/slot-creations/total-applicants?session=SESSION_ID&studentClass=CLASS_ID&tillDate=2026-09-01"
```

## 2. Create New Slot(s)
**POST** `/api/slot-creations`

Use this API when the user clicks "Create Slot". You can send a single object or an array of objects to generate multiple slots at once.

```bash
curl -X POST http://localhost:5000/api/slot-creations \
-H "Content-Type: application/json" \
-d '[
  {
    "session": "SESSION_ID",
    "studentClass": "CLASS_ID",
    "slotName": "Slot 1",
    "slotDate": "2026-09-05T00:00:00Z",
    "startTime": "09:00 AM",
    "endTime": "11:00 AM",
    "capacity": 25,
    "examLocation": "Room 101"
  },
  {
    "session": "SESSION_ID",
    "studentClass": "CLASS_ID",
    "slotName": "Slot 2",
    "slotDate": "2026-09-05T00:00:00Z",
    "startTime": "12:00 PM",
    "endTime": "02:00 PM",
    "capacity": 25,
    "examLocation": "Room 102"
  }
]'
```

## 3. Get All Slots
**GET** `/api/slot-creations`

_Optional query params: `?session=SESSION_ID&studentClass=CLASS_ID`_

```bash
curl -X GET http://localhost:5000/api/slot-creations
```

## 4. Get Slot by ID
**GET** `/api/slot-creations/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X GET http://localhost:5000/api/slot-creations/:id
```

## 5. Update Slot
**PUT** `/api/slot-creations/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X PUT http://localhost:5000/api/slot-creations/:id \
-H "Content-Type: application/json" \
-d '{
  "examLocation": "Main Hall",
  "allotted": 5
}'
```

## 6. Delete Slot
**DELETE** `/api/slot-creations/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X DELETE http://localhost:5000/api/slot-creations/:id
```
