---

# Define School Global Details With FeeType API Documentation

This document contains the cURL commands to test the **School Global Details With FeeType** APIs.
The base URL is `http://localhost:5000`.

## 1. Create New Details
**POST** `/api/school-global-fee-types`

```bash
curl -X POST http://localhost:5000/api/school-global-fee-types \
-H "Content-Type: application/json" \
-d '{
  "feeType": "School Fee",
  "schoolName": "Navals National Academy",
  "schoolAddress": "123 Education Lane",
  "schoolAddress2": "Sector 5",
  "schoolShortName": "NNA",
  "contactNo": "0123-456789",
  "mobile": "9876543210",
  "email": "navalsnationalacademymau@gmail.com",
  "supportEmailId": "support@navals.com",
  "website": "www.navalsnationalacademydohrighat.com",
  "prefix": "NNA",
  "receiptSettings": "Default Receipt",
  "schoolNo": "SCH-001",
  "affiliationTo": "CBSE",
  "affiliationNo": "AFF-54321",
  "associates": "Navals Group",
  "renewUpto": "2030-03-31",
  "schoolStatus": "Active",
  "city": "Dohrighat",
  "eCareMobileNo": "9876543212",
  "workingDays": "220",
  "recess": "45 mins",
  "totalPeriod": "8",
  "isAdmin": false
}'
```

## 2. Get All Details
**GET** `/api/school-global-fee-types`

```bash
curl -X GET http://localhost:5000/api/school-global-fee-types
```

## 3. Get Details by ID
**GET** `/api/school-global-fee-types/:id`

```bash
curl -X GET http://localhost:5000/api/school-global-fee-types/6a8e75341f1655010e58d235
```

## 4. Update Details
**PUT** `/api/school-global-fee-types/:id`

*(Replace `:id` with an actual ID)*
```bash
curl -X PUT http://localhost:5000/api/school-global-fee-types/6a8e75341f1655010e58d235 \
-H "Content-Type: application/json" \
-d '{
  "schoolName": "Navals National Academy Updated"
}'
```

## 5. Delete Details
**DELETE** `/api/school-global-fee-types/:id`

*(Replace `:id` with an actual ID)*
```bash
curl -X DELETE http://localhost:5000/api/school-global-fee-types/6a8e75341f1655010e58d235
```
