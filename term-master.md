---

# Define Term Master API Documentation

This document contains the cURL commands to test the **Term Master** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New Term Master
**POST** `/api/term-masters`

```bash
curl -X POST http://localhost:5000/api/term-masters \
-H "Content-Type: application/json" \
-d '{
  "termName": "we"
}'
```

## 2. Get All Term Masters
**GET** `/api/term-masters`

```bash
curl -X GET http://localhost:5000/api/term-masters
```

## 3. Get Term Master by ID
**GET** `/api/term-masters/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X GET http://localhost:5000/api/term-masters/:id
```

## 4. Update Term Master
**PUT** `/api/term-masters/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X PUT http://localhost:5000/api/term-masters/:id \
-H "Content-Type: application/json" \
-d '{
  "termName": "Updated Term",
  "isActive": true
}'
```

## 5. Delete Term Master
**DELETE** `/api/term-masters/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X DELETE http://localhost:5000/api/term-masters/:id
```
