---

# Define House API Documentation

This document contains the cURL commands to test the **House** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New House
**POST** `/api/houses`

```bash
curl -X POST http://localhost:5000/api/houses \
-H "Content-Type: application/json" \
-d '{
  "houseName": "Red House"
}'
```

## 2. Get All Houses
**GET** `/api/houses`

```bash
curl -X GET http://localhost:5000/api/houses
```

## 3. Get House by ID
**GET** `/api/houses/:id`

```bash
curl -X GET http://localhost:5000/api/houses/6a8e75341f1655010e58d235
```

## 4. Update House
**PUT** `/api/houses/:id`

*(Replace `:id` with an actual ID)*
```bash
curl -X PUT http://localhost:5000/api/houses/6a8e75341f1655010e58d235 \
-H "Content-Type: application/json" \
-d '{
  "houseName": "Blue House",
  "isActive": false
}'
```

## 5. Delete House
**DELETE** `/api/houses/:id`

*(Replace `:id` with an actual ID)*
```bash
curl -X DELETE http://localhost:5000/api/houses/6a8e75341f1655010e58d235
```
