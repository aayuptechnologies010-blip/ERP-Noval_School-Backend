---

# Define Section API Documentation

This document contains the cURL commands to test the **Section** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New Section
**POST** `/api/sections`

```bash
curl -X POST http://localhost:5000/api/sections \
-H "Content-Type: application/json" \
-d '{
  "sectionName": "A",
  "orderNo": 1
}'
```

## 2. Get All Sections
**GET** `/api/sections`

```bash
curl -X GET http://localhost:5000/api/sections
```

## 3. Get Section by ID
**GET** `/api/sections/:id`

```bash
curl -X GET http://localhost:5000/api/sections/6a8e75341f1655010e58d235
```

## 4. Update Section
**PUT** `/api/sections/:id`

*(Replace `:id` with an actual ID)*
```bash
curl -X PUT http://localhost:5000/api/sections/6a8e75341f1655010e58d235 \
-H "Content-Type: application/json" \
-d '{
  "sectionName": "B",
  "orderNo": 2,
  "isActive": true
}'
```

## 5. Delete Section
**DELETE** `/api/sections/:id`

*(Replace `:id` with an actual ID)*
```bash
curl -X DELETE http://localhost:5000/api/sections/6a8e75341f1655010e58d235
```
