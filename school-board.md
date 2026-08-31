---

# Define School Board API Documentation

This document contains the cURL commands to test the **School Board** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New School Board
**POST** `/api/school-boards`

```bash
curl -X POST http://localhost:5000/api/school-boards \
-H "Content-Type: application/json" \
-d '{
  "boardName": "UP",
  "isDefault": true
}'
```

## 2. Get All School Boards
**GET** `/api/school-boards`

```bash
curl -X GET http://localhost:5000/api/school-boards
```

## 3. Get School Board by ID
**GET** `/api/school-boards/:id`

```bash
curl -X GET http://localhost:5000/api/school-boards/6a8e75341f1655010e58d235
```

## 4. Update School Board
**PUT** `/api/school-boards/:id`

*(Replace `:id` with an actual ID)*
```bash
curl -X PUT http://localhost:5000/api/school-boards/6a8e75341f1655010e58d235 \
-H "Content-Type: application/json" \
-d '{
  "boardName": "CBSE",
  "isDefault": false
}'
```

## 5. Delete School Board
**DELETE** `/api/school-boards/:id`

*(Replace `:id` with an actual ID)*
```bash
curl -X DELETE http://localhost:5000/api/school-boards/6a8e75341f1655010e58d235
```
