---

# Define Remark API Documentation

This document contains the cURL commands to test the **Remark** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New Remark
**POST** `/api/remarks`

```bash
curl -X POST http://localhost:5000/api/remarks \
-H "Content-Type: application/json" \
-d '{
  "remarkName": "Excellent in game"
}'
```

## 2. Get All Remarks
**GET** `/api/remarks`

```bash
curl -X GET http://localhost:5000/api/remarks
```

## 3. Get Remark by ID
**GET** `/api/remarks/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X GET http://localhost:5000/api/remarks/:id
```

## 4. Update Remark
**PUT** `/api/remarks/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X PUT http://localhost:5000/api/remarks/:id \
-H "Content-Type: application/json" \
-d '{
  "remarkName": "Excellent in Maths",
  "isActive": true
}'
```

## 5. Delete Remark
**DELETE** `/api/remarks/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X DELETE http://localhost:5000/api/remarks/:id
```
