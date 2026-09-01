---

# Define Reason API Documentation

This document contains the cURL commands to test the **Reason** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New Reason
**POST** `/api/reasons`

```bash
curl -X POST http://localhost:5000/api/reasons \
-H "Content-Type: application/json" \
-d '{
  "reasonName": "srf"
}'
```

## 2. Get All Reasons
**GET** `/api/reasons`

```bash
curl -X GET http://localhost:5000/api/reasons
```

## 3. Get Reason by ID
**GET** `/api/reasons/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X GET http://localhost:5000/api/reasons/:id
```

## 4. Update Reason
**PUT** `/api/reasons/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X PUT http://localhost:5000/api/reasons/:id \
-H "Content-Type: application/json" \
-d '{
  "reasonName": "Updated Reason",
  "isActive": true
}'
```

## 5. Delete Reason
**DELETE** `/api/reasons/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X DELETE http://localhost:5000/api/reasons/:id
```
