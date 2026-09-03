---

# TC Form Setting API Documentation

This document contains the cURL commands to test the **TC Form Setting** APIs.
The base URL is `http://localhost:5000`.

## 1. Get TC Form Setting
**GET** `/api/tc-settings`

Since this is a singleton, this will return the only TC setting document. If it doesn't exist, it will create one with default values and return it.

```bash
curl -X GET http://localhost:5000/api/tc-settings
```

## 2. Update TC Form Setting
**PUT** `/api/tc-settings`

Use this to update the existing TC setting.

```bash
curl -X PUT http://localhost:5000/api/tc-settings \
-H "Content-Type: application/json" \
-d '{
  "subjectFromMarksManager": true,
  "subjectFromTimeTable": true,
  "attendanceFromECare": false,
  "checkDuesInFees": true,
  "checkDuesInLibrary": true
}'
```
