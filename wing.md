---

# Define Wing API Documentation

This document contains the cURL commands to test the **Wing** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New Wing
**POST** `/api/wings`

```bash
curl -X POST http://localhost:5000/api/wings \
-H "Content-Type: application/json" \
-d '{
  "wingName": "Kindergarten"
}'
```

## 2. Get All Wings
**GET** `/api/wings`

```bash
curl -X GET http://localhost:5000/api/wings
```

## 3. Get Wing by ID
**GET** `/api/wings/:id`

```bash
curl -X GET http://localhost:5000/api/wings/6a8e75341f1655010e58d235
```

## 4. Update Wing
**PUT** `/api/wings/:id`

*(Replace `:id` with an actual ID)*
```bash
curl -X PUT http://localhost:5000/api/wings/6a8e75341f1655010e58d235 \
-H "Content-Type: application/json" \
-d '{
  "wingName": "Primary",
  "isActive": false
}'
```

## 5. Delete Wing
**DELETE** `/api/wings/:id`

*(Replace `:id` with an actual ID)*
```bash
curl -X DELETE http://localhost:5000/api/wings/6a8e75341f1655010e58d235
```
