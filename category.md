---

# Define Category API Documentation

This document contains the cURL commands to test the **Category** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New Category
**POST** `/api/categories`

```bash
curl -X POST http://localhost:5000/api/categories \
-H "Content-Type: application/json" \
-d '{
  "name": "Gen",
  "isDefault": true
}'
```

## 2. Get All Categories
**GET** `/api/categories`

```bash
curl -X GET http://localhost:5000/api/categories
```

## 3. Update Category
**PUT** `/api/categories/:id`

*(Replace `:id` with an actual ID)*
```bash
curl -X PUT http://localhost:5000/api/categories/6a8e75341f1655010e58d235 \
-H "Content-Type: application/json" \
-d '{
  "name": "OBC",
  "isDefault": false
}'
```

## 4. Delete Category
**DELETE** `/api/categories/:id`

*(Replace `:id` with an actual ID)*
```bash
curl -X DELETE http://localhost:5000/api/categories/6a8e75341f1655010e58d235
```
