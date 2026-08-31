---

# Define Religion API Documentation

This document contains the cURL commands to test the **Religion** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New Religion
**POST** `/api/religions`

```bash
curl -X POST http://localhost:5000/api/religions \
-H "Content-Type: application/json" \
-d '{
  "religionName": "HINDU"
}'
```

## 2. Get All Religions
**GET** `/api/religions`

```bash
curl -X GET http://localhost:5000/api/religions
```

## 3. Update Religion
**PUT** `/api/religions/:id`

*(Replace `:id` with an actual ID)*
```bash
curl -X PUT http://localhost:5000/api/religions/6a8e75341f1655010e58d235 \
-H "Content-Type: application/json" \
-d '{
  "religionName": "MUSLIM",
  "isActive": true
}'
```

## 4. Delete Religion
**DELETE** `/api/religions/:id`

*(Replace `:id` with an actual ID)*
```bash
curl -X DELETE http://localhost:5000/api/religions/6a8e75341f1655010e58d235
```
