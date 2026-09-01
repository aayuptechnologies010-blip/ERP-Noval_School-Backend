---

# Define Parents Status API Documentation

This document contains the cURL commands to test the **Parents Status** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New Parents Status
**POST** `/api/parents-statuses`

```bash
curl -X POST http://localhost:5000/api/parents-statuses \
-H "Content-Type: application/json" \
-d '{
  "statusName": "Together"
}'
```

## 2. Get All Parents Statuses
**GET** `/api/parents-statuses`

```bash
curl -X GET http://localhost:5000/api/parents-statuses
```

## 3. Get Parents Status by ID
**GET** `/api/parents-statuses/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X GET http://localhost:5000/api/parents-statuses/:id
```

## 4. Update Parents Status
**PUT** `/api/parents-statuses/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X PUT http://localhost:5000/api/parents-statuses/:id \
-H "Content-Type: application/json" \
-d '{
  "statusName": "Divorced",
  "isActive": true
}'
```

## 5. Delete Parents Status
**DELETE** `/api/parents-statuses/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X DELETE http://localhost:5000/api/parents-statuses/:id
```
