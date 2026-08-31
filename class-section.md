---

# Relate Class Section API Documentation

This document contains the cURL commands to test the **Relate Class Section** APIs.
The base URL is `http://localhost:5000`.

## 1. Create / Update Class Section Relation
**POST** `/api/class-sections`

```bash
curl -X POST http://localhost:5000/api/class-sections \
-H "Content-Type: application/json" \
-d '{
  "className": "NUR",
  "sections": ["A", "B", "C"]
}'
```

## 2. Get All Class Section Relations
**GET** `/api/class-sections`

```bash
curl -X GET http://localhost:5000/api/class-sections
```

## 3. Get Sections Related to a Specific Class
**GET** `/api/class-sections/class/:className`

*(Replace `:className` with actual class name, e.g., `NUR`)*
```bash
curl -X GET http://localhost:5000/api/class-sections/class/NUR
```

## 4. Get Relation by ID
**GET** `/api/class-sections/:id`

```bash
curl -X GET http://localhost:5000/api/class-sections/6a8e75341f1655010e58d235
```

## 5. Delete Relation
**DELETE** `/api/class-sections/:id`

*(Replace `:id` with an actual ID)*
```bash
curl -X DELETE http://localhost:5000/api/class-sections/6a8e75341f1655010e58d235
```
