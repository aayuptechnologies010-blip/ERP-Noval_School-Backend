---

# Define TC Caste API Documentation

This document contains the cURL commands to test the **TC Caste** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New Caste
**POST** `/api/castes`

```bash
curl -X POST http://localhost:5000/api/castes \
-H "Content-Type: application/json" \
-d '{
  "name": "General"
}'
```

## 2. Get All Castes
**GET** `/api/castes`

```bash
curl -X GET http://localhost:5000/api/castes
```

## 3. Update Caste
**PUT** `/api/castes/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X PUT http://localhost:5000/api/castes/:id \
-H "Content-Type: application/json" \
-d '{
  "name": "OBC",
  "isActive": true
}'
```

## 4. Delete Caste
**DELETE** `/api/castes/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X DELETE http://localhost:5000/api/castes/:id
```
