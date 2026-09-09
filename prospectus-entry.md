---

# Prospectus Entry API Documentation

This document contains the cURL commands to test the **Prospectus Entry** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New Prospectus Entry
**POST** `/api/prospectus-entries`

```bash
curl -X POST http://localhost:5000/api/prospectus-entries \
-H "Content-Type: application/json" \
-d '{
  "studentClass": "CLASS_ID",
  "board": "All Board",
  "prospectusNo": "PROS-001",
  "date": "2026-09-01T00:00:00Z",
  "session": "SESSION_ID",
  "studentName": "Rahul Kumar",
  "dob": "2015-05-10T00:00:00Z",
  "gender": "Male",
  "fatherName": "Rajesh Kumar",
  "contactMobile": "9876543210",
  "address": {
    "city": "New Delhi",
    "state": "Delhi"
  },
  "paymode": "Cash",
  "isOnline": false
}'
```

## 2. Get All Prospectus Entries
**GET** `/api/prospectus-entries`

_Optional query params: `?session=SESSION_ID&studentClass=CLASS_ID&enquiryNo=ENQ-001`_

```bash
curl -X GET http://localhost:5000/api/prospectus-entries
```

## 3. Get Prospectus Entry by ID
**GET** `/api/prospectus-entries/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X GET http://localhost:5000/api/prospectus-entries/:id
```

## 4. Update Prospectus Entry
**PUT** `/api/prospectus-entries/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X PUT http://localhost:5000/api/prospectus-entries/:id \
-H "Content-Type: application/json" \
-d '{
  "remark": "Test completed",
  "admissionTestDate": "2026-09-05T00:00:00Z",
  "admissionTestTime": "10:00 AM"
}'
```

## 5. Delete Prospectus Entry
**DELETE** `/api/prospectus-entries/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X DELETE http://localhost:5000/api/prospectus-entries/:id
```
