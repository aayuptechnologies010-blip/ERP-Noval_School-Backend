# Admission Manager / Student Lifecycle API Documentation

This document contains all the APIs required by the **Admission Manager** to handle a student's complete lifecycle: from creating a new admission to uploading documents, verifying them, allotting classes, and managing the student profile.

> **Note:** All these APIs require an authentication token (`Bearer YOUR_TOKEN_HERE`). The Admission Manager must log in using the Unified Login API (`POST /api/admin/login`) to get this token.

---

## 1. Create New Admission (POST /api/students)
Used to create a new student record in the system with all their details.

```bash
curl -X POST http://localhost:5000/api/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "studentPhoto=@/path/to/student.jpg" \
  -F "familyPhoto=@/path/to/family.jpg" \
  -F "data={
  \"personalDetails\": {
    \"firstName\": \"Ravi\",
    \"lastName\": \"Kumar\",
    \"dateOfBirth\": \"2010-05-15\",
    \"gender\": \"Male\",
    \"religion\": \"Hindu\",
    \"nationality\": \"Indian\"
  },
  \"academicDetails\": {
    \"admissionNumber\": \"ADM-2026-001\",
    \"dateOfAdmission\": \"2026-04-01\"
  },
  \"contactAddress\": {
    \"contactNumber\": \"9876543210\",
    \"currentAddress\": \"Sector 4, Noida\",
    \"state\": \"UP\"
  },
  \"familyDetails\": {
    \"father\": {
      \"firstName\": \"Suresh\",
      \"lastName\": \"Kumar\",
      \"mobile\": \"9876543210\",
      \"profession\": \"Engineer\"
    },
    \"mother\": {
      \"firstName\": \"Anita\",
      \"lastName\": \"Kumar\",
      \"mobile\": \"8765432109\"
    }
  }
}"
```
*(Copy the `_id` from the response to use as `STUDENT_ID` in subsequent APIs)*

---

## 2. Upload Student Document (POST /api/students/:id/documents)
Used to upload required admission documents (Aadhar, TC, Birth Certificate).

```bash
curl -X POST http://localhost:5000/api/students/STUDENT_ID_HERE/documents \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "documentNames=Aadhar Card" \
  -F "documentNames=Birth Certificate" \
  -F "documents=@/path/to/aadhar.pdf" \
  -F "documents=@/path/to/birth_certificate.pdf"
```
*(Response will include the newly uploaded document with its `_id`, which is the `DOC_ID`)*

---

## 3. Verify Student Document (PATCH /api/students/:id/documents/:docId/verify)
Used by the Admission Manager to mark a specific uploaded document as verified. When all documents are verified, the system automatically sets the student's `isAdmissionVerified` to `true`.

```bash
curl -X PATCH http://localhost:5000/api/students/STUDENT_ID_HERE/documents/DOC_ID_HERE/verify \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "isVerified": true
  }'
```

---

## 4. Class and Section Allotment (PATCH /api/students/:id/allotment)
Used to officially allot a class, section, and roll number to the student after admission is confirmed.

```bash
curl -X PATCH http://localhost:5000/api/students/STUDENT_ID_HERE/allotment \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "assignedClass": "10",
    "assignedSection": "A",
    "rollNumber": "10A-45"
  }'
```

---

## 5. Get All Students (GET /api/students)
Used to fetch a list of all students in the school. Can be used for the Admission Manager's dashboard.

```bash
curl -X GET http://localhost:5000/api/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 6. Get Single Student Profile (GET /api/students/:id)
Used to fetch all details, documents, and status of a specific student.

```bash
curl -X GET http://localhost:5000/api/students/STUDENT_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 7. Update Student Details (PUT /api/students/:id)
Used to edit student information (e.g., correcting spelling mistakes, updating address, changing photos).

```bash
curl -X PUT http://localhost:5000/api/students/STUDENT_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "data={
  \"contactAddress\": {
    \"contactNumber\": \"9999999999\"
  }
}"
```

---

## 8. Delete Student / Cancel Admission (DELETE /api/students/:id)
Used to permanently remove a student record from the system if an admission is cancelled.

```bash
curl -X DELETE http://localhost:5000/api/students/STUDENT_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 9. Pre-Admission: Create Inquiry (POST /api/inquiries)
Log a new parent inquiry before they take admission.

```bash
curl -X POST http://localhost:5000/api/inquiries \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "parentName": "Rahul Sharma",
    "contactNumber": "9876543210",
    "email": "rahul@example.com",
    "childName": "Aryan Sharma",
    "classInterested": "6",
    "status": "Pending",
    "remarks": "Wants to know about transport facility"
  }'
```

---

## 10. Post-Admission: Generate TC (PATCH /api/students/:id/generate-tc)
When a student leaves the school, generate their TC and mark their status as "LEFT".

```bash
curl -X PATCH http://localhost:5000/api/students/STUDENT_ID_HERE/generate-tc \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "tcNumber": "TC-2026-001",
    "leavingDate": "2026-03-31",
    "reason": "Relocating to another city"
  }'
```
