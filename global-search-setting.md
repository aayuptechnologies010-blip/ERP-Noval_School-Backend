---

# Define Global Search Setting API Documentation

This document contains the cURL commands to test the **Global Search Option Settings** APIs.
The base URL is `http://localhost:5000`.

## 1. Get Global Search Settings
**GET** `/api/global-search-settings`

Fetches the current global search options and display settings. If none exist yet, it automatically creates and returns the default settings.

```bash
curl -X GET http://localhost:5000/api/global-search-settings
```

## 2. Update Global Search Settings
**PUT** `/api/global-search-settings`

Updates the search settings globally. You can pass either `searchOptionsForStudents` (with any of its boolean keys) or `displayOnReport` (as a string), or both.

```bash
curl -X PUT http://localhost:5000/api/global-search-settings \
-H "Content-Type: application/json" \
-d '{
  "searchOptionsForStudents": {
    "admNo": true,
    "name": true,
    "fName": true,
    "mName": true,
    "rollNo": false,
    "parentCode": false,
    "mob": false,
    "address": false,
    "stBarcode": false,
    "computerNo": false,
    "busId": false
  },
  "displayOnReport": "Show Admission No"
}'
```

### Note
- `displayOnReport` accepts one of the following strings: `"Show Admission No"`, `"Show Bill"`, `"Show Bus ID"`.
