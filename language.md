---

# Define Language API Documentation

This document contains the cURL commands to test the **Language** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New Language
**POST** `/api/languages`

```bash
curl -X POST http://localhost:5000/api/languages \
-H "Content-Type: application/json" \
-d '{
  "languageName": "Hindi"
}'
```

## 2. Get All Languages
**GET** `/api/languages`

```bash
curl -X GET http://localhost:5000/api/languages
```

## 3. Get Language by ID
**GET** `/api/languages/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X GET http://localhost:5000/api/languages/:id
```

## 4. Update Language
**PUT** `/api/languages/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X PUT http://localhost:5000/api/languages/:id \
-H "Content-Type: application/json" \
-d '{
  "languageName": "Marathi",
  "isActive": true
}'
```

## 5. Delete Language
**DELETE** `/api/languages/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X DELETE http://localhost:5000/api/languages/:id
```
