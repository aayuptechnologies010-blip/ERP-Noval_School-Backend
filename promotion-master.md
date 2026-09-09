---

# Define Promotion Master API Documentation

This document contains the cURL commands to test the **Promotion Master** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New Promotion
**POST** `/api/promotion-masters`

```bash
curl -X POST http://localhost:5000/api/promotion-masters \
-H "Content-Type: application/json" \
-d '{
  "promotionName": "GRANTED"
}'
```

## 2. Get All Promotions
**GET** `/api/promotion-masters`

```bash
curl -X GET http://localhost:5000/api/promotion-masters
```

## 3. Get Promotion by ID
**GET** `/api/promotion-masters/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X GET http://localhost:5000/api/promotion-masters/:id
```

## 4. Update Promotion
**PUT** `/api/promotion-masters/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X PUT http://localhost:5000/api/promotion-masters/:id \
-H "Content-Type: application/json" \
-d '{
  "promotionName": "Studying",
  "isActive": true
}'
```

## 5. Delete Promotion
**DELETE** `/api/promotion-masters/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X DELETE http://localhost:5000/api/promotion-masters/:id
```
