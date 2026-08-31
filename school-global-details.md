---

# Define School Global Details API Documentation

This document contains the cURL commands to test the **School Global Details** APIs.
The base URL is `http://localhost:5000`.

## 1. Create New School Details
**POST** `/api/school-global-details`

```bash
curl -X POST http://localhost:5000/api/school-global-details \
-H "Content-Type: application/json" \
-d '{
  "schoolName": "Navals National Academy",
  "schoolAddress": "123 Education Lane",
  "schoolAddress2": "Sector 5",
  "schoolShortName": "NNA",
  "contactNo": "0123-456789",
  "mobile": "9876543210",
  "secondaryContactNo": "9876543211",
  "emailId": "navalsnationalacademymau@gmail.com",
  "supportEmailId": "support@navals.com",
  "website": "www.navalsnationalacademydohrighat.com",
  "prefix": "NNA",
  "isoDetails": "ISO 9001:2015",
  "establishmentCode": "EST-1990",
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
  "schoolCategory": "Co-Ed",
  "uDiseRegistrationNo": "UDISE-998877",
  "facebookId": "navals.academy",
  "supportTime": "9:00AM - 6:00PM",
  "supportDays": "Mon-Sat",
  "isMainSchool": true
}'
```

## 2. Get All School Details
**GET** `/api/school-global-details`

```bash
curl -X GET http://localhost:5000/api/school-global-details
```

## 3. Get School Details by ID
**GET** `/api/school-global-details/:id`

```bash
curl -X GET http://localhost:5000/api/school-global-details/6a8e75341f1655010e58d235
```

## 4. Update School Details
**PUT** `/api/school-global-details/:id`

*(Replace `:id` with an actual ID)*
```bash
curl -X PUT http://localhost:5000/api/school-global-details/6a8e75341f1655010e58d235 \
-H "Content-Type: application/json" \
-d '{
  "schoolName": "Navals National Academy Updated"
}'
```

## 5. Delete School Details
**DELETE** `/api/school-global-details/:id`

*(Replace `:id` with an actual ID)*
```bash
curl -X DELETE http://localhost:5000/api/school-global-details/6a8e75341f1655010e58d235
```
