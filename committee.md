---

# Define Committee API Documentation

This document contains the cURL commands to test the **Committee** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New Committee Record
**POST** `/api/committees`

```bash
curl -X POST http://localhost:5000/api/committees \
-H "Content-Type: application/json" \
-d '{
  "committeeType": "Discipline Committee",
  "designation": "Chairman",
  "memberType": "Employee",
  "memberName": "John Doe",
  "fromDate": "2026-08-31",
  "toDate": "2027-08-31",
  "isActive": true
}'
```

## 2. Get All Committee Records
**GET** `/api/committees`

```bash
curl -X GET http://localhost:5000/api/committees
```

## 3. Get Committee Record by ID
**GET** `/api/committees/:id`

```bash
curl -X GET http://localhost:5000/api/committees/6a8e75341f1655010e58d235
```

## 4. Update Committee Record
**PUT** `/api/committees/:id`

*(Replace `:id` with an actual ID)*
```bash
curl -X PUT http://localhost:5000/api/committees/6a8e75341f1655010e58d235 \
-H "Content-Type: application/json" \
-d '{
  "designation": "Vice Chairman",
  "isActive": false
}'
```

## 5. Delete Committee Record
**DELETE** `/api/committees/:id`

*(Replace `:id` with an actual ID)*
```bash
curl -X DELETE http://localhost:5000/api/committees/6a8e75341f1655010e58d235
```
