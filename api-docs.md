# Admin API Documentation

This document contains cURL commands to test the Admin API endpoints. Note: Replace `YOUR_TOKEN_HERE` with the actual JWT token you receive after logging in.

## 1. Register Admin

Create a new admin.

```bash
curl -X POST http://localhost:5000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Shiva",
    "lastName": "Mayank",
    "username": "admin123",
    "email": "admin@example.com",
    "password": "password123"
  }'
```

## 2. Login Admin

Login to get the JWT token.

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin123",
    "password": "password123"
  }'
```

## 3. Get Admin Profile

Fetch the logged-in admin's profile.

```bash
curl -X GET http://localhost:5000/api/admin/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 4. Update Admin Profile (With Image Upload)

Updates the admin profile. This endpoint uses `multipart/form-data` because it accepts a profile image file along with text fields.

```bash
# To test this via curl with an image file:
# Replace `/path/to/your/image.jpg` with an actual image path on your system.

curl -X PUT http://localhost:5000/api/admin/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "firstName=Shiva Updated" \
  -F "lastName=Mayank" \
  -F "phone=+91-9876543210" \
  -F "gender=Male" \
  -F "dob=1980-05-15" \
  -F "address=123 School Lane, City, State" \
  -F "qualification=M.Ed, Ph.D in Education" \
  -F "experience=15 Years" \
  -F "joiningDate=2015-08-01" \
  -F "profileImage=@/path/to/your/image.jpg"
```

_(Note: You can omit the `-F "profileImage=..."` if you just want to update text fields without uploading a new image)_

## 5. Change Password

Change the admin's password.

```bash
curl -X PUT http://localhost:5000/api/admin/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "oldPassword": "password123",
    "newPassword": "newpassword456"
  }'
```

````

---

# Role Management API Documentation

Note: Replace `YOUR_TOKEN_HERE` with the Admin JWT token.

## 1. Create a Role
Create a new role.
```bash
curl -X POST http://localhost:5000/api/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "roleName": "Teacher",
    "description": "Access to student grading and attendance",
    "isActive": true
  }'
````

## 2. View All Roles

Get a list of all roles.

```bash
curl -X GET http://localhost:5000/api/roles \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 3. View a Single Role

Get a specific role by ID. Replace `ROLE_ID_HERE`.

```bash
curl -X GET http://localhost:5000/api/roles/ROLE_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 4. Update a Role

Edit role details (like name or description). Replace `ROLE_ID_HERE`.

```bash
curl -X PUT http://localhost:5000/api/roles/ROLE_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "roleName": "Senior Teacher",
    "description": "Updated access details"
  }'
```

## 5. Toggle Role Status (Active/Inactive)

Toggle the `isActive` status of a role. Replace `ROLE_ID_HERE`.

```bash
curl -X PATCH http://localhost:5000/api/roles/ROLE_ID_HERE/status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 6. Delete a Role

Permanently remove a role. Replace `ROLE_ID_HERE`.

```bash
curl -X DELETE http://localhost:5000/api/roles/ROLE_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

````

---

# Student Admission API Documentation

Note: Replace `YOUR_TOKEN_HERE` with the Admin JWT token.

## 1. Create a Student (Admission)
Create a new student with all details and upload multiple photos.
```bash
# This uses multipart/form-data. The main data payload is sent as a JSON string under the "data" field.
# Replace the image paths with actual files on your machine.

curl -X POST http://localhost:5000/api/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F 'data={
    "personalDetails": {
      "firstName": "ARNAV",
      "middleName": "KUMAR",
      "lastName": "GUPTA",
      "dateOfBirth": "2023-03-15",
      "gender": "Male",
      "religion": "HINDU",
      "caste": "General",
      "subCaste": "",
      "nationality": "Indian",
      "placeOfBirth": "Delhi",
      "motherTongue": "Hindi",
      "parish": "0",
      "schoolCategory": "General",
      "houseNames": "Red House",
      "isNachEcs": false,
      "isEwsCwsn": "0",
      "isMinority": false,
      "isDisabilityCwsn": false,
      "disabilityDescription": "",
      "isRte": "0",
      "clubs": "Science Club",
      "cadetType": "NCC",
      "statesNationalCompetitions": "0",
      "foodStatus": "Veg",
      "boardingHostel": "No",
      "isOnlyChild": false
    },
    "academicDetails": {
      "admissionNumber": "1770",
      "admissionStatus": "Continuous",
      "currentStatus": "STUDYING",
      "reason": "New Admission",
      "rollNumber": "1",
      "class": "NUR",
      "section": "A",
      "board": "CBSE",
      "dateOfAdmission": "2025-04-11",
      "dateOfJoining": "2025-04-11",
      "stream": "None",
      "optionalSubject": "",
      "previousClass": "0",
      "sixSubject": ""
    },
    "uniqueIds": {
      "udiseNumber": "123456789",
      "pen": "987654321",
      "apaarId": "112233",
      "ePunjabNumber": "445566",
      "feesNumber": "778899",
      "saralNumber": "332211",
      "srnNumber": "556677",
      "issen": false,
      "abhaNumber": "998877",
      "billGrNumber": "665544",
      "studentNumber": "111222",
      "rfidCardNumber": "AABBCC11"
    },
    "contactAddress": {
      "contactNumber": "+91-8112580707",
      "secondaryContactNo": "+91-9876543210",
      "studentEmail": "student@example.com",
      "currentAddress": "RAM LEELA BHAWAN GONTHA",
      "pinCode": "275303",
      "city": "MAU",
      "state": "UP",
      "permanentAddress": "SAME AS CURRENT",
      "permanentPinCode": "275303",
      "permanentCity": "MAU",
      "permanentState": "UP",
      "domicileState": "UP"
    },
    "familyDetails": {
      "familyId": "FAM-001",
      "parentStatus": "Married",
      "staffName": "",
      "father": {
        "title": "Mr.",
        "firstName": "HANUMAN",
        "middleName": "",
        "lastName": "GUPTA",
        "aadharNumber": "1234-5678-9012",
        "panNumber": "ABCDE1234F",
        "annualIncome": "500000",
        "dob": "1980-01-01",
        "mobile": "8957244533",
        "phone": "0548-123456",
        "email": "father@example.com",
        "residenceAddress": "RAM LEELA BHAWAN GONTHA",
        "qualification": "B.Com",
        "profession": "Business",
        "professionDetails": "Retail",
        "designation": "Owner",
        "designationDetails": "Shop Owner",
        "companyName": "Gupta Traders",
        "businessDetails": "General Store",
        "serviceIn": "Private",
        "officeAddress": "Main Market, Mau",
        "officePhone": "0548-654321",
        "officeMobile": "9988776655",
        "officeExtension": "01",
        "officeEmail": "office@guptatraders.com",
        "officeWebsite": "www.guptatraders.com",
        "isAlumni": "No",
        "batchYear": ""
      },
      "mother": {
        "title": "Mrs.",
        "firstName": "GAURI",
        "middleName": "",
        "lastName": "GUPTA",
        "aadharNumber": "9876-5432-1098",
        "panNumber": "ZYXWV9876U",
        "annualIncome": "0",
        "dob": "1985-05-05",
        "mobile": "9876543210",
        "phone": "",
        "email": "mother@example.com",
        "residenceAddress": "RAM LEELA BHAWAN GONTHA",
        "qualification": "B.A",
        "profession": "Housewife",
        "professionDetails": "",
        "designation": "",
        "designationDetails": "",
        "companyName": "",
        "businessDetails": "",
        "serviceIn": "",
        "officeAddress": "",
        "officePhone": "",
        "officeMobile": "",
        "officeExtension": "",
        "officeEmail": "",
        "officeWebsite": "",
        "isAlumni": "No",
        "batchYear": "",
        "anniversaryDate": "2010-02-14"
      }
    },
    "guardianDetails": {
      "title": "Mr.",
      "name": "Local Guardian Name",
      "dob": "1975-08-20",
      "income": "300000",
      "relationship": "Uncle",
      "mobile": "9123456780",
      "phone": "",
      "email": "guardian@example.com",
      "residenceAddress": "123 Guardian St",
      "qualification": "M.Sc",
      "profession": "Teacher",
      "professionDetails": "Math Teacher",
      "designation": "Senior Teacher",
      "companyName": "City School",
      "businessDetails": "",
      "serviceIn": "Education",
      "officeAddress": "City School Campus",
      "officePhone": "",
      "officeMobile": "",
      "officeExtension": "",
      "officeEmail": "",
      "officeWebsite": "",
      "secondaryGuardianName": "Aunt Name",
      "secondaryGuardianMobile": "9876501234",
      "secondaryGuardianRelationship": "Aunt"
    },
    "emergencyContacts": [
      {
        "name": "Emergency Contact 1",
        "smsNumber": "9998887776",
        "email": "em1@example.com",
        "mobileNumber": "9998887776",
        "phoneNumber": "",
        "address": "Hospital Road",
        "relation": "Doctor"
      },
      {
        "name": "Emergency Contact 2",
        "smsNumber": "8887776665",
        "email": "em2@example.com",
        "mobileNumber": "8887776665",
        "phoneNumber": "",
        "address": "Neighbors House",
        "relation": "Neighbor"
      }
    ]
  }' \
  -F "studentPhoto=@/path/to/student.jpg" \
  -F "fatherPhoto=@/path/to/father.jpg" \
  -F "motherPhoto=@/path/to/mother.jpg" \
  -F "familyPhoto=@/path/to/family.jpg"
````

## 2. View All Students

Get a list of all students.

```bash
curl -X GET http://localhost:5000/api/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 3. View a Single Student

Get a specific student by ID. Replace `STUDENT_ID_HERE`.

```bash
curl -X GET http://localhost:5000/api/students/STUDENT_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 4. Update a Student

Edit student details and optionally upload new photos. Replace `STUDENT_ID_HERE`.

```bash
curl -X PUT http://localhost:5000/api/students/STUDENT_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F 'data={
    "personalDetails": {
      "firstName": "ARNAV UPDATED",
      "middleName": "KUMAR",
      "lastName": "GUPTA",
      "dateOfBirth": "2023-03-15",
      "gender": "Male",
      "religion": "HINDU",
      "caste": "General",
      "subCaste": "",
      "nationality": "Indian",
      "placeOfBirth": "Delhi",
      "motherTongue": "Hindi",
      "parish": "0",
      "schoolCategory": "General",
      "houseNames": "Red House",
      "isNachEcs": false,
      "isEwsCwsn": "0",
      "isMinority": false,
      "isDisabilityCwsn": false,
      "disabilityDescription": "",
      "isRte": "0",
      "clubs": "Science Club",
      "cadetType": "NCC",
      "statesNationalCompetitions": "0",
      "foodStatus": "Veg",
      "boardingHostel": "No",
      "isOnlyChild": false
    },
    "academicDetails": {
      "admissionNumber": "1770",
      "admissionStatus": "Continuous",
      "currentStatus": "STUDYING",
      "reason": "New Admission",
      "rollNumber": "1",
      "class": "NUR",
      "section": "A",
      "board": "CBSE",
      "dateOfAdmission": "2025-04-11",
      "dateOfJoining": "2025-04-11",
      "stream": "None",
      "optionalSubject": "",
      "previousClass": "0",
      "sixSubject": ""
    },
    "uniqueIds": {
      "udiseNumber": "123456789",
      "pen": "987654321",
      "apaarId": "112233",
      "ePunjabNumber": "445566",
      "feesNumber": "778899",
      "saralNumber": "332211",
      "srnNumber": "556677",
      "issen": false,
      "abhaNumber": "998877",
      "billGrNumber": "665544",
      "studentNumber": "111222",
      "rfidCardNumber": "AABBCC11"
    },
    "contactAddress": {
      "contactNumber": "+91-8112580707",
      "secondaryContactNo": "+91-9876543210",
      "studentEmail": "student@example.com",
      "currentAddress": "RAM LEELA BHAWAN GONTHA",
      "pinCode": "275303",
      "city": "MAU",
      "state": "UP",
      "permanentAddress": "SAME AS CURRENT",
      "permanentPinCode": "275303",
      "permanentCity": "MAU",
      "permanentState": "UP",
      "domicileState": "UP"
    },
    "familyDetails": {
      "familyId": "FAM-001",
      "parentStatus": "Married",
      "staffName": "",
      "father": {
        "title": "Mr.",
        "firstName": "HANUMAN",
        "middleName": "",
        "lastName": "GUPTA",
        "aadharNumber": "1234-5678-9012",
        "panNumber": "ABCDE1234F",
        "annualIncome": "500000",
        "dob": "1980-01-01",
        "mobile": "8957244533",
        "phone": "0548-123456",
        "email": "father@example.com",
        "residenceAddress": "RAM LEELA BHAWAN GONTHA",
        "qualification": "B.Com",
        "profession": "Business",
        "professionDetails": "Retail",
        "designation": "Owner",
        "designationDetails": "Shop Owner",
        "companyName": "Gupta Traders",
        "businessDetails": "General Store",
        "serviceIn": "Private",
        "officeAddress": "Main Market, Mau",
        "officePhone": "0548-654321",
        "officeMobile": "9988776655",
        "officeExtension": "01",
        "officeEmail": "office@guptatraders.com",
        "officeWebsite": "www.guptatraders.com",
        "isAlumni": "No",
        "batchYear": ""
      },
      "mother": {
        "title": "Mrs.",
        "firstName": "GAURI",
        "middleName": "",
        "lastName": "GUPTA",
        "aadharNumber": "9876-5432-1098",
        "panNumber": "ZYXWV9876U",
        "annualIncome": "0",
        "dob": "1985-05-05",
        "mobile": "9876543210",
        "phone": "",
        "email": "mother@example.com",
        "residenceAddress": "RAM LEELA BHAWAN GONTHA",
        "qualification": "B.A",
        "profession": "Housewife",
        "professionDetails": "",
        "designation": "",
        "designationDetails": "",
        "companyName": "",
        "businessDetails": "",
        "serviceIn": "",
        "officeAddress": "",
        "officePhone": "",
        "officeMobile": "",
        "officeExtension": "",
        "officeEmail": "",
        "officeWebsite": "",
        "isAlumni": "No",
        "batchYear": "",
        "anniversaryDate": "2010-02-14"
      }
    },
    "guardianDetails": {
      "title": "Mr.",
      "name": "Local Guardian Name",
      "dob": "1975-08-20",
      "income": "300000",
      "relationship": "Uncle",
      "mobile": "9123456780",
      "phone": "",
      "email": "guardian@example.com",
      "residenceAddress": "123 Guardian St",
      "qualification": "M.Sc",
      "profession": "Teacher",
      "professionDetails": "Math Teacher",
      "designation": "Senior Teacher",
      "companyName": "City School",
      "businessDetails": "",
      "serviceIn": "Education",
      "officeAddress": "City School Campus",
      "officePhone": "",
      "officeMobile": "",
      "officeExtension": "",
      "officeEmail": "",
      "officeWebsite": "",
      "secondaryGuardianName": "Aunt Name",
      "secondaryGuardianMobile": "9876501234",
      "secondaryGuardianRelationship": "Aunt"
    },
    "emergencyContacts": [
      {
        "name": "Emergency Contact 1",
        "smsNumber": "9998887776",
        "email": "em1@example.com",
        "mobileNumber": "9998887776",
        "phoneNumber": "",
        "address": "Hospital Road",
        "relation": "Doctor"
      }
    ]
  }' \
  -F "studentPhoto=@/path/to/new_student_photo.jpg"
```

## 5. Delete a Student

Permanently remove a student. Replace `STUDENT_ID_HERE`.

```bash
curl -X DELETE http://localhost:5000/api/students/STUDENT_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

# Staff Management API

All Staff API endpoints are protected and require a valid Admin JWT token in the `Authorization: Bearer <token>` header.

## 1. Create a Staff Member

Create a new staff with all details and an optional photo.

```bash
# This uses multipart/form-data. The main data payload is sent as a JSON string under the "data" field.
# IMPORTANT: Provide a valid Role ID for the "role" field.

curl -X POST http://localhost:5000/api/staffs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F 'data={
    "title": "Miss.",
    "firstName": "AARADHYA",
    "lastName": "VERMA",
    "userName": "SF066",
    "role": "ROLE_ID_HERE",
    "designation": "Teacher",
    "gender": "Female",
    "doj": "2026-01-27",
    "dob": "2006-02-28",
    "contactNo": "8127535725",
    "qualification": "M.Sc B.Ed",
    "aadharCardNo": "1234-5678-9012",
    "nationalTeacherId": "",
    "stateTeacherId": "",
    "cbseId": "",
    "maritalStatus": "Unmarried",
    "fatherSpouseName": "RAKESH VERMA",
    "fatherSpouseContactNo": "",
    "dateOfAnniversary": "1900-01-01",
    "alternateMobile": "",
    "emergencyContactNo": "",
    "emailId": "aaradhya@example.com",
    "alternateEmailId": "",
    "religion": "HINDU",
    "nationality": "Indian",
    "address": "DOHARIGHA MAU",
    "permanentAddress": "VIKASH NAGAR 6/638 LUCKNOW"
  }' \
  -F "staffPhoto=@/path/to/staff.jpg"
```

## 2. View All Staff

Get a list of all staff members.

```bash
curl -X GET http://localhost:5000/api/staffs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 3. View a Single Staff Member

Get a specific staff by ID. Replace `STAFF_ID_HERE`.

```bash
curl -X GET http://localhost:5000/api/staffs/STAFF_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 4. Update a Staff Member

Edit staff details and optionally upload a new photo. Replace `STAFF_ID_HERE`. Supports partial deep updates.

```bash
curl -X PUT http://localhost:5000/api/staffs/STAFF_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F 'data={
    "title": "Miss.",
    "firstName": "AARADHYA",
    "lastName": "VERMA",
    "userName": "SF066",
    "role": "ROLE_ID_HERE",
    "designation": "Teacher",
    "gender": "Female",
    "doj": "2026-01-27",
    "dob": "2006-02-28",
    "contactNo": "8127535725",
    "qualification": "M.Sc B.Ed",
    "aadharCardNo": "1234-5678-9012",
    "nationalTeacherId": "",
    "stateTeacherId": "",
    "cbseId": "",
    "maritalStatus": "Married",
    "fatherSpouseName": "RAKESH VERMA",
    "fatherSpouseContactNo": "",
    "dateOfAnniversary": "1900-01-01",
    "alternateMobile": "",
    "emergencyContactNo": "",
    "emailId": "aaradhya@example.com",
    "alternateEmailId": "",
    "religion": "HINDU",
    "nationality": "Indian",
    "address": "DOHARIGHA MAU",
    "permanentAddress": "VIKASH NAGAR 6/638 LUCKNOW"
  }' \
  -F "staffPhoto=@/path/to/new_staff_photo.jpg"
```

## 5. Toggle Staff Status (Active/Inactive)

Toggle the `isActive` status of a staff member. Replace `STAFF_ID_HERE`.

```bash
curl -X PATCH http://localhost:5000/api/staffs/STAFF_ID_HERE/status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 6. Delete a Staff Member

Permanently remove a staff member. Replace `STAFF_ID_HERE`.

```bash
curl -X DELETE http://localhost:5000/api/staffs/STAFF_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
