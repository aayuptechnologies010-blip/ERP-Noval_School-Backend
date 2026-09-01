---

# Define Student Classification API Documentation

This document contains the cURL commands to test the **Student Classification** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New Classification
**POST** `/api/student-classifications`

```bash
curl -X POST http://localhost:5000/api/student-classifications \
-H "Content-Type: application/json" \
-d '{
  "classificationName": "Emirates"
}'
```

## 2. Get All Classifications
**GET** `/api/student-classifications`

```bash
curl -X GET http://localhost:5000/api/student-classifications
```

## 3. Get Classification by ID
**GET** `/api/student-classifications/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X GET http://localhost:5000/api/student-classifications/:id
```

## 4. Update Classification
**PUT** `/api/student-classifications/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X PUT http://localhost:5000/api/student-classifications/:id \
-H "Content-Type: application/json" \
-d '{
  "classificationName": "Non Emirates",
  "isActive": true
}'
```

## 5. Delete Classification
**DELETE** `/api/student-classifications/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X DELETE http://localhost:5000/api/student-classifications/:id
```
