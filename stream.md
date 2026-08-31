---

# Define Stream API Documentation

This document contains the cURL commands to test the **Stream** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New Stream
**POST** `/api/streams`

```bash
curl -X POST http://localhost:5000/api/streams \
-H "Content-Type: application/json" \
-d '{
  "streamName": "Science"
}'
```

## 2. Get All Streams
**GET** `/api/streams`

```bash
curl -X GET http://localhost:5000/api/streams
```

## 3. Get Stream by ID
**GET** `/api/streams/:id`

```bash
curl -X GET http://localhost:5000/api/streams/6a8e75341f1655010e58d235
```

## 4. Update Stream
**PUT** `/api/streams/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X PUT http://localhost:5000/api/streams/6a8e75341f1655010e58d235 \
-H "Content-Type: application/json" \
-d '{
  "streamName": "Commerce",
  "isActive": true
}'
```

## 5. Delete Stream
**DELETE** `/api/streams/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X DELETE http://localhost:5000/api/streams/6a8e75341f1655010e58d235
```
