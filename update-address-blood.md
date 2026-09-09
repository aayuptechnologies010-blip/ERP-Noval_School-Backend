---

# Update Address and Blood API Documentation

This document contains the cURL commands to test the **Update Address and Blood** API.
The base URL is `http://localhost:5000`.

## 1. Bulk Update Address and Blood Group
**PUT** `/api/students/bulk/address-blood`

This API takes an array of updates. You only need to provide `address` or `bloodGroup` if you are modifying them.

```bash
curl -X PUT http://localhost:5000/api/students/bulk/address-blood \
-H "Content-Type: application/json" \
-d '{
  "updates": [
    {
      "studentId": "STUDENT_ID_1",
      "address": "123 New Block, Sector 5",
      "bloodGroup": "O+"
    },
    {
      "studentId": "STUDENT_ID_2",
      "address": "456 Old Street, Delhi"
    },
    {
      "studentId": "STUDENT_ID_3",
      "bloodGroup": "A-"
    }
  ]
}'
```

_Note:_
_1. To get the `studentId`, you can use the existing GET `/api/students?class=Class_Name&section=Section_Name` API._
_2. This API requires the user to be authenticated._
