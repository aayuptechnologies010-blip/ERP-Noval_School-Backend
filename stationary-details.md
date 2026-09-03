---

# Stationary Details API Documentation

This document contains the cURL commands to test the **Stationary Details** APIs.
The base URL is `http://localhost:5000`.

## 1. Create New Stationary Details
**POST** `/api/stationary-details`

```bash
curl -X POST http://localhost:5000/api/stationary-details \
-H "Content-Type: application/json" \
-d '{
  "stationaryName": "Notebooks Set",
  "amount": 500,
  "postAccountName": "General Supplies",
  "school": "SCHOOL_ID",
  "session": "SESSION_ID"
}'
```

## 2. Get All Stationary Details
**GET** `/api/stationary-details`

_Optional query params: `?school=SCHOOL_ID&session=SESSION_ID`_

```bash
curl -X GET "http://localhost:5000/api/stationary-details?school=SCHOOL_ID&session=SESSION_ID"
```

## 3. Get Stationary Details by ID
**GET** `/api/stationary-details/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X GET http://localhost:5000/api/stationary-details/:id
```

## 4. Update Stationary Details
**PUT** `/api/stationary-details/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X PUT http://localhost:5000/api/stationary-details/:id \
-H "Content-Type: application/json" \
-d '{
  "stationaryName": "Updated Notebooks Set",
  "amount": 550
}'
```

## 5. Delete Stationary Details
**DELETE** `/api/stationary-details/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X DELETE http://localhost:5000/api/stationary-details/:id
```
