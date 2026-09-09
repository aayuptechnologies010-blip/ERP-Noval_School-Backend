---

# Define Extra Activity API Documentation

This document contains the cURL commands to test the **Extra Activity** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New Extra Activity
**POST** `/api/extra-activities`

```bash
curl -X POST http://localhost:5000/api/extra-activities \
-H "Content-Type: application/json" \
-d '{
  "activityName": "Drawing"
}'
```

## 2. Get All Extra Activities
**GET** `/api/extra-activities`

```bash
curl -X GET http://localhost:5000/api/extra-activities
```

## 3. Get Extra Activity by ID
**GET** `/api/extra-activities/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X GET http://localhost:5000/api/extra-activities/:id
```

## 4. Update Extra Activity
**PUT** `/api/extra-activities/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X PUT http://localhost:5000/api/extra-activities/:id \
-H "Content-Type: application/json" \
-d '{
  "activityName": "Painting",
  "isActive": true
}'
```

## 5. Delete Extra Activity
**DELETE** `/api/extra-activities/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X DELETE http://localhost:5000/api/extra-activities/:id
```
