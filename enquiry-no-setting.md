---

# Define Enquiry No Setting API Documentation

This document contains the cURL commands to test the **Enquiry No. Setting** APIs.
The base URL is `http://localhost:5000`.

## 1. Get Enquiry No Setting for a Session
**GET** `/api/enquiry-no-settings/:sessionId`

Fetches the Enquiry No settings for a specific academic session. If no settings exist yet for that session, the API will automatically generate and return a default configuration for it.

_(Replace `:sessionId` with the actual `_id` of the selected AcademicYear)_

```bash
curl -X GET http://localhost:5000/api/enquiry-no-settings/:sessionId
```

## 2. Update Enquiry No Setting for a Session
**PUT** `/api/enquiry-no-settings/:sessionId`

Updates the Enquiry No settings for the specific session.

_(Replace `:sessionId` with the actual `_id` of the selected AcademicYear)_

```bash
curl -X PUT http://localhost:5000/api/enquiry-no-settings/:sessionId \
-H "Content-Type: application/json" \
-d '{
  "enquiryNoType": "Automatic",
  "prefix": "ENQ-",
  "startFrom": 1,
  "leadZero": 4,
  "suffix": "-26"
}'
```

### Note
- `enquiryNoType` accepts enum values: `"Automatic"`, `"Manual"`.
- `prefix` and `suffix` are strings.
- `startFrom` and `leadZero` are numbers. 
- You do not need to pass the `session` ID inside the JSON payload because it is taken from the URL parameter.
