---

# Enquiry API Documentation

This document contains the cURL commands to test the **Enquiry** APIs.
The base URL is `http://localhost:5000`.

## 1. Get Last Enquiry Number (Generate New)
**GET** `/api/enquiries/last-number/generate`

Use this API for the "Get Last Enquiry No." button on the frontend. It fetches the latest enquiry number and generates the next one.

```bash
curl -X GET http://localhost:5000/api/enquiries/last-number/generate
```

## 2. Create a New Enquiry
**POST** `/api/enquiries`

```bash
curl -X POST http://localhost:5000/api/enquiries \
-H "Content-Type: application/json" \
-d '{
  "enquiryNo": "ENQ-0001",
  "session": "SESSION_ID",
  "enquiryDate": "2026-09-01T00:00:00Z",
  "studentName": "Rahul Kumar",
  "dob": "2015-05-10T00:00:00Z",
  "admissionInClass": "Class 5",
  "fatherName": "Rajesh Kumar",
  "fatherMobile": "9876543210",
  "gender": "Male"
}'
```

## 3. Get All Enquiries (With Filters)
**GET** `/api/enquiries`

You can use various query parameters to filter enquiries, which is especially useful for the **Enquiry FollowUp** view.

_Optional query params:_
- `session=SESSION_ID`
- `enquiryDate=YYYY-MM-DD` (For "Enquiry Date wise" filter)
- `followUpDate=YYYY-MM-DD` (For "Follow-up Date wise" filter)
- `studentDetails=search_text` (For "Student Detail wise" filter - searches name, contact, enquiryNo)

```bash
curl -X GET "http://localhost:5000/api/enquiries?followUpDate=2026-09-01&session=SESSION_ID"
```

## 4. Get Enquiry by ID
**GET** `/api/enquiries/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X GET http://localhost:5000/api/enquiries/:id
```

## 5. Add Follow-Up to Enquiry
**POST** `/api/enquiries/:id/follow-ups`

Use this API to add a follow-up action to a specific enquiry.

```bash
curl -X POST http://localhost:5000/api/enquiries/:id/follow-ups \
-H "Content-Type: application/json" \
-d '{
  "followUpDate": "2026-09-05T00:00:00Z",
  "remark": "Called parent, they will visit tomorrow.",
  "counsellor": "Mr. Sharma",
  "enquiryType": "Hot",
  "enquiryStatus": "Follow-up"
}'
```

## 6. Update Enquiry
**PUT** `/api/enquiries/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X PUT http://localhost:5000/api/enquiries/:id \
-H "Content-Type: application/json" \
-d '{
  "studentAddress": "123 Main Street, New Delhi",
  "howDidYouKnow": "Social Media"
}'
```

## 7. Delete Enquiry
**DELETE** `/api/enquiries/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X DELETE http://localhost:5000/api/enquiries/:id
```
