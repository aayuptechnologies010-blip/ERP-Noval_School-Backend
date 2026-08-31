---

# Define School Classes API Documentation

This document contains the cURL commands to test the **School Classes** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New School Class
**POST** `/api/school-classes`

```bash
curl -X POST http://localhost:5000/api/school-classes \
-H "Content-Type: application/json" \
-d '{
  "className": "PRI",
  "wingName": "Kindergarten",
  "schoolName": "NAVALS NATIONAL ACADEMY",
  "orderNo": 1
}'
```

## 2. Get All School Classes
**GET** `/api/school-classes`

```bash
curl -X GET http://localhost:5000/api/school-classes
```

## 3. Update School Class
**PUT** `/api/school-classes/:id`

*(Replace `:id` with an actual ID)*
```bash
curl -X PUT http://localhost:5000/api/school-classes/6a8e75341f1655010e58d235 \
-H "Content-Type: application/json" \
-d '{
  "className": "LKG",
  "wingName": "Kindergarten",
  "schoolName": "NAVALS NATIONAL ACADEMY",
  "orderNo": 2,
  "isActive": true
}'
```

## 4. Delete School Class
**DELETE** `/api/school-classes/:id`

*(Replace `:id` with an actual ID)*
```bash
curl -X DELETE http://localhost:5000/api/school-classes/6a8e75341f1655010e58d235
```
