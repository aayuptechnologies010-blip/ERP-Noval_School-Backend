---

# Define Parish API Documentation

This document contains the cURL commands to test the **Parish** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New Parish
**POST** `/api/parishes`

```bash
curl -X POST http://localhost:5000/api/parishes \
-H "Content-Type: application/json" \
-d '{
  "name": "St. Josephs Church, Greater Noida",
  "religion": ["Christian"]
}'
```

## 2. Get All Parishes
**GET** `/api/parishes`

```bash
curl -X GET http://localhost:5000/api/parishes
```

## 3. Update Parish
**PUT** `/api/parishes/:id`

*(Replace `:id` with an actual ID)*
```bash
curl -X PUT http://localhost:5000/api/parishes/6a8e75341f1655010e58d235 \
-H "Content-Type: application/json" \
-d '{
  "name": "Testing Parish",
  "religion": ["Hindu", "Sikh"],
  "isActive": true
}'
```

## 4. Delete Parish
**DELETE** `/api/parishes/:id`

*(Replace `:id` with an actual ID)*
```bash
curl -X DELETE http://localhost:5000/api/parishes/6a8e75341f1655010e58d235
```
