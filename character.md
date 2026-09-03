---

# Define Character API Documentation

This document contains the cURL commands to test the **Character** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New Character
**POST** `/api/characters`

```bash
curl -X POST http://localhost:5000/api/characters \
-H "Content-Type: application/json" \
-d '{
  "characterName": "Very Good"
}'
```

## 2. Get All Characters
**GET** `/api/characters`

```bash
curl -X GET http://localhost:5000/api/characters
```

## 3. Get Character by ID
**GET** `/api/characters/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X GET http://localhost:5000/api/characters/:id
```

## 4. Update Character
**PUT** `/api/characters/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X PUT http://localhost:5000/api/characters/:id \
-H "Content-Type: application/json" \
-d '{
  "characterName": "Excellent",
  "isActive": true
}'
```

## 5. Delete Character
**DELETE** `/api/characters/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X DELETE http://localhost:5000/api/characters/:id
```
