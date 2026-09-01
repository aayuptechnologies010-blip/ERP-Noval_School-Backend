---

# Define Session Transfer API Documentation

This document contains the cURL commands to test the **Session Transfer** API.
The base URL is `http://localhost:5000`.

## 1. Transfer Session Data
**POST** `/api/session-transfer`

This endpoint accepts the current and next academic sessions and a list of modules to transfer (e.g., Class Section Relations, Students).

```bash
curl -X POST http://localhost:5000/api/session-transfer \
-H "Content-Type: application/json" \
-d '{
  "currentSession": "2026-2027",
  "currentFinancialYear": "2026-2027",
  "nextSession": "2027-2028",
  "nextFinancialYear": "2027-2028",
  "modulesToTransfer": [
    "Class Section Relation",
    "Student Transfer"
  ]
}'
```

### Notes
- `currentSession` and `nextSession` are **required** fields.
- `modulesToTransfer` should be an array containing the names of the tables/modules you have selected from the UI.
- The actual data copying logic (e.g., cloning student records or mapping sections to the new session) would be implemented internally based on the selected modules.
