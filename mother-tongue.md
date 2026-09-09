---

# Define Mother Tongue API Documentation

This document contains the cURL commands to test the **Mother Tongue** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New Mother Tongue
**POST** `/api/mother-tongues`

```bash
curl -X POST http://localhost:5000/api/mother-tongues \
-H "Content-Type: application/json" \
-d '{
  "motherTongueName": "Hindi"
}'
```

## 2. Get All Mother Tongues
**GET** `/api/mother-tongues`

```bash
curl -X GET http://localhost:5000/api/mother-tongues
```

## 3. Get Mother Tongue by ID
**GET** `/api/mother-tongues/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X GET http://localhost:5000/api/mother-tongues/:id
```

## 4. Update Mother Tongue
**PUT** `/api/mother-tongues/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X PUT http://localhost:5000/api/mother-tongues/:id \
-H "Content-Type: application/json" \
-d '{
  "motherTongueName": "English",
  "isActive": true
}'
```

## 5. Delete Mother Tongue
**DELETE** `/api/mother-tongues/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X DELETE http://localhost:5000/api/mother-tongues/:id
```
