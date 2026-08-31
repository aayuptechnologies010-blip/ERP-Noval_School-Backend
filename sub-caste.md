---

# Define Sub Caste API Documentation

This document contains the cURL commands to test the **Sub Caste** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New Sub Caste
**POST** `/api/sub-castes`

```bash
curl -X POST http://localhost:5000/api/sub-castes \
-H "Content-Type: application/json" \
-d '{
  "name": "Pandey"
}'
```

## 2. Get All Sub Castes
**GET** `/api/sub-castes`

```bash
curl -X GET http://localhost:5000/api/sub-castes
```

## 3. Update Sub Caste
**PUT** `/api/sub-castes/:id`

*(Replace `:id` with an actual ID)*
```bash
curl -X PUT http://localhost:5000/api/sub-castes/6a8e75341f1655010e58d235 \
-H "Content-Type: application/json" \
-d '{
  "name": "Sharma",
  "isActive": true
}'
```

## 4. Delete Sub Caste
**DELETE** `/api/sub-castes/:id`

*(Replace `:id` with an actual ID)*
```bash
curl -X DELETE http://localhost:5000/api/sub-castes/6a8e75341f1655010e58d235
```
