---

# Define Last Result API Documentation

This document contains the cURL commands to test the **Last Result** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New Last Result
**POST** `/api/last-results`

```bash
curl -X POST http://localhost:5000/api/last-results \
-H "Content-Type: application/json" \
-d '{
  "lastResultName": "we"
}'
```

## 2. Get All Last Results
**GET** `/api/last-results`

```bash
curl -X GET http://localhost:5000/api/last-results
```

## 3. Get Last Result by ID
**GET** `/api/last-results/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X GET http://localhost:5000/api/last-results/:id
```

## 4. Update Last Result
**PUT** `/api/last-results/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X PUT http://localhost:5000/api/last-results/:id \
-H "Content-Type: application/json" \
-d '{
  "lastResultName": "Updated Result",
  "isActive": true
}'
```

## 5. Delete Last Result
**DELETE** `/api/last-results/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X DELETE http://localhost:5000/api/last-results/:id
```
