---

# Define Optional Subject API Documentation

This document contains the cURL commands to test the **Optional Subject** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New Optional Subject
**POST** `/api/optional-subjects`

```bash
curl -X POST http://localhost:5000/api/optional-subjects \
-H "Content-Type: application/json" \
-d '{
  "subjectName": "Computer Science"
}'
```

## 2. Get All Optional Subjects
**GET** `/api/optional-subjects`

```bash
curl -X GET http://localhost:5000/api/optional-subjects
```

## 3. Get Optional Subject by ID
**GET** `/api/optional-subjects/:id`

```bash
curl -X GET http://localhost:5000/api/optional-subjects/6a8e75341f1655010e58d235
```

## 4. Update Optional Subject
**PUT** `/api/optional-subjects/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X PUT http://localhost:5000/api/optional-subjects/6a8e75341f1655010e58d235 \
-H "Content-Type: application/json" \
-d '{
  "subjectName": "Physical Education",
  "isActive": false
}'
```

## 5. Delete Optional Subject
**DELETE** `/api/optional-subjects/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X DELETE http://localhost:5000/api/optional-subjects/6a8e75341f1655010e58d235
```
