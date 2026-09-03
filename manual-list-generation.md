---

# Manual List Generation API Documentation

This document contains the cURL commands to test the **Manual List Generation** APIs.
The base URL is `http://localhost:5000`.

## 1. Get Students for Manual List

**GET** `/api/manual-list-generation`

Fetches students from Prospectus Entries based on filters.

_Optional query params:_

- `studentClass=CLASS_ID`
- `meritList=MERIT_LIST_NAME`
- `admDateFrom=YYYY-MM-DD`
- `admDateTo=YYYY-MM-DD`
- `session=SESSION_ID`

```bash
curl -X GET "http://localhost:5000/api/manual-list-generation?studentClass=CLASS_ID&admDateFrom=2026-09-01&admDateTo=2026-09-30"
```

## 2. Update Manual List / Status

**PUT** `/api/manual-list-generation`

Updates the admission status, selected class, remark, and merit list date for multiple students at once.
The `id` field corresponds to the `_id` of the Prospectus Entry.

```bash
curl -X PUT http://localhost:5000/api/manual-list-generation \
-H "Content-Type: application/json" \
-d '{
  "selectDate": "2026-09-02T00:00:00Z",
  "meritList": "First List",
  "students": [
    {
      "id": "PROSPECTUS_ENTRY_ID_1",
      "selectedClass": "Class 1",
      "admStatus": "Selected",
      "remark": "Good marks"
    },
    {
      "id": "PROSPECTUS_ENTRY_ID_2",
      "selectedClass": "Class 1",
      "admStatus": "Rejected",
      "remark": "Failed test"
    }
  ]
}'
```
