---

# Define Club API Documentation

This document contains the cURL commands to test the **Club** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New Club
**POST** `/api/clubs`

```bash
curl -X POST http://localhost:5000/api/clubs \
-H "Content-Type: application/json" \
-d '{
  "clubName": "Science Club"
}'
```

## 2. Get All Clubs
**GET** `/api/clubs`

```bash
curl -X GET http://localhost:5000/api/clubs
```

## 3. Get Club by ID
**GET** `/api/clubs/:id`

```bash
curl -X GET http://localhost:5000/api/clubs/6a8e75341f1655010e58d235
```

## 4. Update Club
**PUT** `/api/clubs/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X PUT http://localhost:5000/api/clubs/6a8e75341f1655010e58d235 \
-H "Content-Type: application/json" \
-d '{
  "clubName": "Math Club",
  "isActive": false
}'
```

## 5. Delete Club
**DELETE** `/api/clubs/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X DELETE http://localhost:5000/api/clubs/6a8e75341f1655010e58d235
```
