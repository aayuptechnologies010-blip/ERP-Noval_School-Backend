---

# Meeting Details API Documentation

This document contains the cURL commands to test the **Meeting Details** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New Meeting Detail

**POST** `/api/meeting-details`

```bash
curl -X POST http://localhost:5000/api/meeting-details \
-H "Content-Type: application/json" \
-d '{
  "committeeType": "Discipline Committee",
  "meetingDate": "2026-08-31",
  "noOfMembers": 5,
  "description": "Monthly discipline review meeting"
}'
```

## 2. Get All Meeting Details

**GET** `/api/meeting-details`

```bash
curl -X GET http://localhost:5000/api/meeting-details
```

## 3. Get Meeting Detail by ID

**GET** `/api/meeting-details/:id`

```bash
curl -X GET http://localhost:5000/api/meeting-details/6a8e75341f1655010e58d235
```

## 4. Update Meeting Detail

**PUT** `/api/meeting-details/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X PUT http://localhost:5000/api/meeting-details/6a8e75341f1655010e58d235 \
-H "Content-Type: application/json" \
-d '{
  "noOfMembers": 6,
  "description": "Updated meeting details"
}'
```

## 5. Delete Meeting Detail

**DELETE** `/api/meeting-details/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X DELETE http://localhost:5000/api/meeting-details/6a8e75341f1655010e58d235
```
