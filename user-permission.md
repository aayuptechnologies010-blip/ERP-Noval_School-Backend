---

# Define User Permission API Documentation

This document contains the cURL commands to test the **User Permission** APIs.
The base URL is `http://localhost:5000`.

## 1. Get Dropdown Options
**GET** `/api/user-permissions/options`

This API dynamically fetches the list of active Users (Staff) and available Schools to populate the dropdowns.

```bash
curl -X GET http://localhost:5000/api/user-permissions/options
```

## 2. Get User Permission for a Specific User
**GET** `/api/user-permissions/:userId`

Fetches the list of schools a specific user has permission to access. If no permissions are set yet, it automatically returns an empty array for schools.

_(Replace `:userId` with the actual `_id` of the selected Staff user)_

```bash
curl -X GET http://localhost:5000/api/user-permissions/:userId
```

## 3. Update User Permission (Map Schools to User)
**POST** `/api/user-permissions/:userId`

Updates or creates the permission mapping for the user. Pass an array of School IDs that the user should have access to.

_(Replace `:userId` with the actual `_id` of the selected Staff user)_

```bash
curl -X POST http://localhost:5000/api/user-permissions/:userId \
-H "Content-Type: application/json" \
-d '{
  "schools": [
    "6a95861e5d9048616a2e3404", 
    "6a95861e5d9048616a2e3405"
  ]
}'
```

### Notes
- `:userId` parameter in the URL is **required** and should match the `_id` from the Users array in the options API.
- The `schools` property in the JSON body should be an array of School `_id` strings.
