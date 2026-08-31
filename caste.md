---

# Define Caste API Documentation

This document contains the cURL commands to test the **Caste** APIs.
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

*(Replace `:id` with an actual ID)*
```bash
curl -X PUT http://localhost:5000/api/castes/6a8e75341f1655010e58d235 \
-H "Content-Type: application/json" \
-d '{
  "name": "OBC",
  "isActive": true
}'
```

## 4. Delete Caste
**DELETE** `/api/castes/:id`

*(Replace `:id` with an actual ID)*
```bash
curl -X DELETE http://localhost:5000/api/castes/6a8e75341f1655010e58d235
```
