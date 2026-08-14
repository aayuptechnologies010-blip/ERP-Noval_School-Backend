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

Get a list of all students. You can optionally filter by class and section using query parameters.

```bash
# To get all students:
curl -X GET http://localhost:5000/api/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# To filter by class and section:
curl -X GET "http://localhost:5000/api/students?class=UKG&section=A" \
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

## 6. Toggle Student Favorite Status

Mark or unmark a student as favorite. Replace `STUDENT_ID_HERE`.

```bash
curl -X PATCH http://localhost:5000/api/students/STUDENT_ID_HERE/favorite \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 7. Get All Favorite Students

Get a list of all students marked as favorite.

```bash
curl -X GET http://localhost:5000/api/students/favorites \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 8. Bulk Update Roll Numbers

Update the roll numbers of multiple students at once. This is useful for assigning roll numbers in a specific class and section.

```bash
curl -X PUT http://localhost:5000/api/students/bulk/roll-numbers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "updates": [
      { "studentId": "STUDENT_ID_1_HERE", "rollNumber": "01" },
      { "studentId": "STUDENT_ID_2_HERE", "rollNumber": "02" }
    ]
  }'
```

## 9. Bulk Update House Names

Update the house names/allocations of multiple students at once.

```bash
curl -X PUT http://localhost:5000/api/students/bulk/house-names \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "updates": [
      { "studentId": "STUDENT_ID_1_HERE", "houseName": "Red House" },
      { "studentId": "STUDENT_ID_2_HERE", "houseName": "Blue House" }
    ]
  }'
```

## 10. Bulk Update Photos

Update the photos of multiple students at once. This endpoint accepts `multipart/form-data`. The field name for each file MUST be the `studentId` of the student whose photo is being uploaded. Optionally, you can prefix the `studentId` with `photo_` (e.g., `photo_STUDENT_ID_1_HERE`).

```bash
# Replace STUDENT_ID_1_HERE and STUDENT_ID_2_HERE with actual student IDs
# Replace paths with actual image paths on your system

curl -X PUT http://localhost:5000/api/students/bulk/photos \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "STUDENT_ID_1_HERE=@/path/to/student1_photo.jpg" \
  -F "STUDENT_ID_2_HERE=@/path/to/student2_photo.jpg"
```

## 11. Bulk Update Clubs

Update the club allocations of multiple students at once.

```bash
curl -X PUT http://localhost:5000/api/students/bulk/clubs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "updates": [
      { "studentId": "STUDENT_ID_1_HERE", "club": "Science Club" },
      { "studentId": "STUDENT_ID_2_HERE", "club": "Arts Club" }
    ]
  }'
```

---

# Album Management API

All Album API endpoints are protected and require a valid Admin JWT token in the `Authorization: Bearer <token>` header.

## 1. Create an Album

Create a new album with an optional cover image.

```bash
# This uses multipart/form-data. The main data payload is sent as a JSON string under the "data" field.

curl -X POST http://localhost:5000/api/albums \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F 'data={
    "title": "Prize Distribution",
    "eventDate": "2024-12-24",
    "totalMemories": 46,
    "isActive": true
  }' \
  -F "coverImage=@/path/to/cover_image.jpg"
```

## 2. View All Albums

Get a list of all albums.

```bash
curl -X GET http://localhost:5000/api/albums \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 3. View a Single Album

Get a specific album by ID (includes single view image path). Replace `ALBUM_ID_HERE`.

```bash
curl -X GET http://localhost:5000/api/albums/ALBUM_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 4. Update an Album

Edit album details and optionally upload a new cover image. Replace `ALBUM_ID_HERE`.

```bash
curl -X PUT http://localhost:5000/api/albums/ALBUM_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F 'data={
    "title": "Annual Prize Distribution",
    "eventDate": "2024-12-25",
    "totalMemories": 50,
    "isActive": true
  }' \
  -F "coverImage=@/path/to/new_cover_image.jpg"
```

## 5. Delete an Album

Permanently remove an album. Replace `ALBUM_ID_HERE`.

```bash
curl -X DELETE http://localhost:5000/api/albums/ALBUM_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 6. Toggle Album Status (Active/Inactive)

Toggle the `isActive` status of an album. Replace `ALBUM_ID_HERE`.

```bash
curl -X PATCH http://localhost:5000/api/albums/ALBUM_ID_HERE/status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

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

## 7. Toggle Staff Favorite Status

Mark or unmark a staff member as favorite. Replace `STAFF_ID_HERE`.

```bash
curl -X PATCH http://localhost:5000/api/staffs/STAFF_ID_HERE/favorite \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 8. Get All Favorite Staff

Get a list of all staff members marked as favorite.

```bash
curl -X GET http://localhost:5000/api/staffs/favorites \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

# Report Management API

All Report API endpoints are protected and require a valid Admin JWT token in the `Authorization: Bearer <token>` header.

## 1. Get Birthday Report

Get a list of birthdays for students and/or staffs. Supports filtering by month, type (Student/Staff) and searching by name.

```bash
# Query Parameters (All optional):
# - type: 'Student' or 'Staff' or 'All'
# - month: 1 to 12
# - search: search text for name

curl -X GET "http://localhost:5000/api/reports/birthdays?type=All&month=8&search=" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 2. Get Month-wise Birthday Distribution (Chart Data)

Get the count of birthdays for each month (Jan-Dec) combining both Students and Staffs.

```bash
curl -X GET http://localhost:5000/api/reports/birthdays/chart \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 3. Get Today's Birthdays

Get the list of students and staffs whose birthday is today.

```bash
curl -X GET http://localhost:5000/api/reports/birthdays/today \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

---

# Student Attendance API Documentation

> **Base URL:** `http://localhost:5000/api/attendance`
> All endpoints require `Authorization: Bearer YOUR_TOKEN_HERE` header.
>
> **Attendance Status Values:**
> | Value | Label | Description |
> |---|---|---|
> | `Present` | P | Student was present |
> | `Absent` | A | Student was absent |
> | `Leave` | L | Approved leave |
> | `HalfDay` | WH | Half day attendance |
> | `Late` | Late | Came late |
> | `NA` | NA | Not applicable (holiday etc.) |

---

## A1. Mark / Bulk Upsert Attendance

Mark attendance for all students of a class on a specific date. If a record for a student already exists for that date it will be **updated** (upsert). Send all students at once.

```bash
curl -X POST http://localhost:5000/api/attendance/mark \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "date": "2026-08-03",
    "class": "UKG",
    "section": "A",
    "records": [
      { "studentId": "STUDENT_OBJECT_ID_1", "status": "Present",  "remarks": "" },
      { "studentId": "STUDENT_OBJECT_ID_2", "status": "Absent",   "remarks": "Sick" },
      { "studentId": "STUDENT_OBJECT_ID_3", "status": "Leave",    "remarks": "Family function" },
      { "studentId": "STUDENT_OBJECT_ID_4", "status": "HalfDay",  "remarks": "" },
      { "studentId": "STUDENT_OBJECT_ID_5", "status": "Late",     "remarks": "Bus delay" },
      { "studentId": "STUDENT_OBJECT_ID_6", "status": "NA",       "remarks": "Holiday" }
    ]
  }'
```

**Success Response (200):**

```json
{
  "message": "Attendance marked successfully",
  "date": "2026-08-03T00:00:00.000Z",
  "class": "UKG",
  "section": "A",
  "inserted": 4,
  "updated": 2,
  "total": 6
}
```

---

## A2. Get Attendance by Class + Date

Fetch all attendance records for a specific class, section, and date. Returns full student info with their attendance status.

```bash
# With section filter
curl -X GET "http://localhost:5000/api/attendance?class=UKG&section=A&date=2026-08-03" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Without section (all sections of a class)
curl -X GET "http://localhost:5000/api/attendance?class=UKG&date=2026-08-03" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response (200):**

```json
{
  "date": "2026-08-03T00:00:00.000Z",
  "class": "UKG",
  "section": "A",
  "summary": {
    "Present": 6,
    "Absent": 1,
    "Leave": 1,
    "HalfDay": 0,
    "Late": 0,
    "NA": 0,
    "Total": 8
  },
  "records": [
    {
      "_id": "...",
      "studentId": {
        "_id": "...",
        "personalDetails": {
          "firstName": "Arnav",
          "lastName": "Gupta",
          "studentPhoto": "http://localhost:5000/uploads/studentPhoto-123.jpg"
        },
        "academicDetails": {
          "admissionNumber": "1770",
          "rollNumber": "01",
          "class": "UKG",
          "section": "A"
        }
      },
      "status": "Present",
      "remarks": "",
      "date": "2026-08-03T00:00:00.000Z"
    }
  ]
}
```

---

## A3. Update Single Attendance Record

Update the attendance status or remark of one specific record using its `_id`.

```bash
curl -X PUT http://localhost:5000/api/attendance/ATTENDANCE_RECORD_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "status": "Present",
    "remarks": "Came after roll call"
  }'
```

**Success Response (200):**

```json
{
  "message": "Attendance updated successfully",
  "record": {
    "_id": "...",
    "studentId": "...",
    "date": "2026-08-03T00:00:00.000Z",
    "class": "UKG",
    "section": "A",
    "status": "Present",
    "remarks": "Came after roll call"
  }
}
```

---

## A4. Get Student-wise Attendance History

Get full attendance history of a specific student. Optionally filter by month and/or year. Returns attendance percentage.

```bash
# Full history
curl -X GET "http://localhost:5000/api/attendance/student/STUDENT_OBJECT_ID" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by month & year
curl -X GET "http://localhost:5000/api/attendance/student/STUDENT_OBJECT_ID?month=8&year=2026" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by year only
curl -X GET "http://localhost:5000/api/attendance/student/STUDENT_OBJECT_ID?year=2026" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response (200):**

```json
{
  "student": {
    "_id": "...",
    "personalDetails": { "firstName": "Arnav", "lastName": "Gupta" },
    "academicDetails": { "admissionNumber": "1770", "rollNumber": "01" }
  },
  "summary": {
    "Present": 20,
    "Absent": 2,
    "Leave": 1,
    "HalfDay": 1,
    "Late": 0,
    "NA": 0,
    "Total": 24
  },
  "attendancePercentage": "87.50%",
  "totalRecords": 24,
  "records": [
    {
      "_id": "...",
      "date": "2026-08-03T00:00:00.000Z",
      "status": "Present",
      "remarks": ""
    }
  ]
}
```

---

## A5. Get Attendance Summary (Counts)

Get just the count of each status for a class+section on a specific date. This powers the summary bar on top of the Mark Attendance screen.

```bash
curl -X GET "http://localhost:5000/api/attendance/summary?class=UKG&section=A&date=2026-08-03" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response (200):**

```json
{
  "date": "2026-08-03T00:00:00.000Z",
  "class": "UKG",
  "section": "A",
  "summary": {
    "Present": 6,
    "Absent": 1,
    "Leave": 0,
    "HalfDay": 1,
    "Late": 0,
    "NA": 0,
    "Total": 8
  }
}
```

---

## A6. Monthly Attendance Report (Matrix)

Get a full month-wise attendance matrix for a class. Each student row shows their status for every working date in the month, plus a summary and attendance percentage.

```bash
curl -X GET "http://localhost:5000/api/attendance/report/monthly?class=UKG&section=A&month=8&year=2026" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Without section (all sections combined)
curl -X GET "http://localhost:5000/api/attendance/report/monthly?class=UKG&month=8&year=2026" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response (200):**

```json
{
  "class": "UKG",
  "section": "A",
  "month": 8,
  "year": 2026,
  "workingDates": ["2026-08-01", "2026-08-02", "2026-08-03"],
  "totalWorkingDays": 3,
  "students": [
    {
      "studentId": "...",
      "name": "Arnav Gupta",
      "admissionNumber": "1770",
      "rollNumber": "01",
      "attendance": {
        "2026-08-01": { "status": "Present", "remarks": "" },
        "2026-08-02": { "status": "Present", "remarks": "" },
        "2026-08-03": { "status": "Absent", "remarks": "Sick" }
      },
      "summary": {
        "Present": 2,
        "Absent": 1,
        "Leave": 0,
        "HalfDay": 0,
        "Late": 0,
        "NA": 0,
        "Total": 3
      },
      "attendancePercentage": "66.67%"
    }
  ]
}
```

---

## A7. Today's Attendance Summary (Dashboard)

Get today's attendance summary across all classes. Returns overall counts and a per-class breakdown. Perfect for the admin dashboard widget.

```bash
curl -X GET http://localhost:5000/api/attendance/today \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response (200):**

```json
{
  "date": "2026-08-09T00:00:00.000Z",
  "overallSummary": {
    "Present": 320,
    "Absent": 15,
    "Leave": 8,
    "HalfDay": 3,
    "Late": 4,
    "NA": 0,
    "Total": 350
  },
  "classSummaries": [
    {
      "class": "UKG",
      "section": "A",
      "summary": {
        "Present": 6,
        "Absent": 1,
        "Leave": 0,
        "HalfDay": 1,
        "Late": 0,
        "NA": 0,
        "Total": 8
      }
    },
    {
      "class": "1",
      "section": "B",
      "summary": {
        "Present": 28,
        "Absent": 2,
        "Leave": 0,
        "HalfDay": 0,
        "Late": 0,
        "NA": 0,
        "Total": 30
      }
    }
  ],
  "totalClassesCovered": 2
}
```

---

## A8. Get Attendance Marked Dates

Get the list of dates on which attendance was marked for a particular class. Useful to highlight working days on a calendar UI.

```bash
# Get all dates for a class-section
curl -X GET "http://localhost:5000/api/attendance/dates?class=UKG&section=A" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by month & year
curl -X GET "http://localhost:5000/api/attendance/dates?class=UKG&section=A&month=8&year=2026" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by year only
curl -X GET "http://localhost:5000/api/attendance/dates?class=UKG&year=2026" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response (200):**

```json
{
  "class": "UKG",
  "section": "A",
  "totalDays": 3,
  "dates": ["2026-08-01", "2026-08-02", "2026-08-03"]
}
```

---

## A9. Delete Attendance Record

Permanently delete a specific attendance record by its `_id`.

```bash
curl -X DELETE http://localhost:5000/api/attendance/ATTENDANCE_RECORD_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response (200):**

```json
{
  "message": "Attendance record deleted successfully",
  "record": {
    "_id": "...",
    "studentId": "...",
    "date": "2026-08-03T00:00:00.000Z",
    "class": "UKG",
    "section": "A",
    "status": "Present"
  }
}
```

**Error Responses (All Endpoints):**

```json
{ "message": "Not authorized, no token" }           // 401 - Missing token
{ "message": "Not authorized, token failed" }        // 401 - Invalid token
{ "message": "Attendance record not found." }         // 404 - Wrong ID
{ "message": "date, class, and records[] are required." } // 400 - Missing fields
{ "message": "Internal server error message" }        // 500 - Server error
```

---

---

# Leave Requests API Documentation

> **Base URL:** `http://localhost:5000/api/leave-requests`
> All endpoints require `Authorization: Bearer YOUR_TOKEN_HERE` header.
>
> **Leave Status Values:**
> | Value | Color | Description |
> |---|---|---|
> | `Pending` | 🟡 Orange | Newly submitted, awaiting admin action |
> | `Approved` | 🟢 Green | Admin approved the leave |
> | `Rejected` | 🔴 Red | Admin rejected the leave |

---

## L1. Create Leave Request

Submit a new leave request for a student. `totalDays` is automatically calculated from `fromDate` and `toDate` (inclusive). Class and Section are auto-filled from the student's profile.

```bash
curl -X POST http://localhost:5000/api/leave-requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "studentId": "STUDENT_OBJECT_ID",
    "fromDate": "2026-08-01",
    "toDate": "2026-08-02",
    "reason": "Fever"
  }'
```

**Success Response (201):**

```json
{
  "message": "Leave request created successfully",
  "leaveRequest": {
    "_id": "LEAVE_REQUEST_ID",
    "studentId": {
      "_id": "STUDENT_OBJECT_ID",
      "personalDetails": {
        "firstName": "Arnav",
        "lastName": "Gupta",
        "studentPhoto": "http://localhost:5000/uploads/studentPhoto-123.jpg"
      },
      "academicDetails": {
        "admissionNumber": "1770",
        "class": "NUR",
        "section": "A",
        "rollNumber": "01"
      }
    },
    "fromDate": "2026-08-01T00:00:00.000Z",
    "toDate": "2026-08-02T23:59:59.999Z",
    "totalDays": 2,
    "reason": "Fever",
    "status": "Pending",
    "adminRemarks": "",
    "reviewedBy": null,
    "reviewedAt": null,
    "class": "NUR",
    "section": "A",
    "createdAt": "2026-07-30T00:00:00.000Z"
  }
}
```

---

## L2. Get All Leave Requests (with Filters)

Fetch all leave requests. Supports filtering by **class**, **section**, **status**, **date range**, and **search** (student name or admission number). Also supports pagination.

```bash
# All leave requests (no filter)
curl -X GET "http://localhost:5000/api/leave-requests" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by class
curl -X GET "http://localhost:5000/api/leave-requests?class=NUR" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by status
curl -X GET "http://localhost:5000/api/leave-requests?status=Pending" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by date range (leaves starting in this range)
curl -X GET "http://localhost:5000/api/leave-requests?fromDate=2026-08-01&toDate=2026-08-31" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Search by student name or admission number
curl -X GET "http://localhost:5000/api/leave-requests?search=Arnav" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Combined filters (like the screenshot: Class + Status + Date Range)
curl -X GET "http://localhost:5000/api/leave-requests?class=NUR&section=A&status=Pending&fromDate=2026-08-01&toDate=2026-08-31" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# With pagination (page 2, 10 per page)
curl -X GET "http://localhost:5000/api/leave-requests?page=2&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response (200):**

```json
{
  "total": 25,
  "page": 1,
  "limit": 50,
  "leaveRequests": [
    {
      "_id": "LEAVE_REQUEST_ID",
      "studentId": {
        "_id": "STUDENT_OBJECT_ID",
        "personalDetails": { "firstName": "Arnav", "lastName": "Gupta" },
        "academicDetails": {
          "admissionNumber": "1770",
          "class": "NUR",
          "section": "A"
        }
      },
      "fromDate": "2026-08-01T00:00:00.000Z",
      "toDate": "2026-08-02T23:59:59.999Z",
      "totalDays": 2,
      "reason": "Fever",
      "status": "Pending",
      "adminRemarks": "",
      "reviewedBy": null,
      "createdAt": "2026-07-30T00:00:00.000Z"
    },
    {
      "_id": "LEAVE_REQUEST_ID_2",
      "studentId": {
        "personalDetails": { "firstName": "Anvi", "lastName": "Maurya" },
        "academicDetails": {
          "admissionNumber": "2203",
          "class": "NUR",
          "section": "A"
        }
      },
      "fromDate": "2026-08-03T00:00:00.000Z",
      "toDate": "2026-08-05T23:59:59.999Z",
      "totalDays": 3,
      "reason": "Family Function",
      "status": "Approved",
      "adminRemarks": "Approved",
      "reviewedBy": { "firstName": "Shiva", "lastName": "Mayank" },
      "createdAt": "2026-08-01T00:00:00.000Z"
    }
  ]
}
```

---

## L3. Get Single Leave Request

Get full details of one leave request by its ID.

```bash
curl -X GET http://localhost:5000/api/leave-requests/LEAVE_REQUEST_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response (200):**

```json
{
  "_id": "LEAVE_REQUEST_ID",
  "studentId": {
    "_id": "STUDENT_OBJECT_ID",
    "personalDetails": {
      "firstName": "Arnav",
      "lastName": "Gupta",
      "studentPhoto": "..."
    },
    "academicDetails": {
      "admissionNumber": "1770",
      "class": "NUR",
      "section": "A",
      "rollNumber": "01"
    }
  },
  "fromDate": "2026-08-01T00:00:00.000Z",
  "toDate": "2026-08-02T23:59:59.999Z",
  "totalDays": 2,
  "reason": "Fever",
  "status": "Pending",
  "adminRemarks": "",
  "reviewedBy": null,
  "reviewedAt": null,
  "class": "NUR",
  "section": "A",
  "createdAt": "2026-07-30T00:00:00.000Z",
  "updatedAt": "2026-07-30T00:00:00.000Z"
}
```

---

## L4. Approve or Reject a Leave Request

Admin uses this to approve ✅ or reject ❌ a leave request. Optionally add `adminRemarks`. Can also reset back to `Pending`.

```bash
# Approve a leave request
curl -X PATCH http://localhost:5000/api/leave-requests/LEAVE_REQUEST_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "status": "Approved",
    "adminRemarks": "Approved. Get well soon."
  }'
r
# Reject a leave equest
curl -X PATCH http://localhost:5000/api/leave-requests/LEAVE_REQUEST_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "status": "Rejected",
    "adminRemarks": "Insufficient reason provided."
  }'

# Reset back to Pending
curl -X PATCH http://localhost:5000/api/leave-requests/LEAVE_REQUEST_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "status": "Pending",
    "adminRemarks": ""
  }'
```

**Success Response (200):**

```json
{
  "message": "Leave request approved successfully",
  "leaveRequest": {
    "_id": "LEAVE_REQUEST_ID",
    "studentId": {
      "personalDetails": { "firstName": "Arnav", "lastName": "Gupta" },
      "academicDetails": {
        "admissionNumber": "1770",
        "class": "NUR",
        "section": "A"
      }
    },
    "status": "Approved",
    "adminRemarks": "Approved. Get well soon.",
    "reviewedBy": { "firstName": "Shiva", "lastName": "Mayank" },
    "reviewedAt": "2026-08-09T18:30:00.000Z"
  }
}
```

---

## L5. Delete a Leave Request

Permanently delete a leave request.

```bash
curl -X DELETE http://localhost:5000/api/leave-requests/LEAVE_REQUEST_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response (200):**

```json
{
  "message": "Leave request deleted successfully",
  "leaveRequest": {
    "_id": "LEAVE_REQUEST_ID",
    "reason": "Fever",
    "status": "Pending",
    "totalDays": 2
  }
}
```

---

## L6. Get Student's Leave Request History

Get all leave requests submitted for a specific student. Filter by status and/or year. Returns a summary with total approved leave days.

```bash
# Full history
curl -X GET "http://localhost:5000/api/leave-requests/student/STUDENT_OBJECT_ID" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by status
curl -X GET "http://localhost:5000/api/leave-requests/student/STUDENT_OBJECT_ID?status=Approved" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by year
curl -X GET "http://localhost:5000/api/leave-requests/student/STUDENT_OBJECT_ID?year=2026" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by status and year
curl -X GET "http://localhost:5000/api/leave-requests/student/STUDENT_OBJECT_ID?status=Approved&year=2026" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response (200):**

```json
{
  "student": {
    "_id": "STUDENT_OBJECT_ID",
    "personalDetails": { "firstName": "Arnav", "lastName": "Gupta" },
    "academicDetails": {
      "admissionNumber": "1770",
      "class": "NUR",
      "section": "A"
    }
  },
  "summary": {
    "Pending": 1,
    "Approved": 3,
    "Rejected": 1,
    "Total": 5
  },
  "approvedLeaveDays": 8,
  "leaveRequests": [
    {
      "_id": "...",
      "fromDate": "2026-08-01T00:00:00.000Z",
      "toDate": "2026-08-02T23:59:59.999Z",
      "totalDays": 2,
      "reason": "Fever",
      "status": "Approved",
      "adminRemarks": "Approved",
      "reviewedBy": { "firstName": "Shiva", "lastName": "Mayank" },
      "createdAt": "2026-07-30T00:00:00.000Z"
    }
  ]
}
```

---

## L7. Leave Request Statistics (Dashboard)

Get aggregated statistics for leave requests. Useful for the admin dashboard. Optionally filter by class, month, and year. Also returns the 5 most recent pending requests.

```bash
# Overall stats (all time)
curl -X GET "http://localhost:5000/api/leave-requests/stats" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Stats for a specific class
curl -X GET "http://localhost:5000/api/leave-requests/stats?class=NUR" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Stats for a specific month & year
curl -X GET "http://localhost:5000/api/leave-requests/stats?month=8&year=2026" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Stats for a class in a specific month
curl -X GET "http://localhost:5000/api/leave-requests/stats?class=NUR&month=8&year=2026" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response (200):**

```json
{
  "stats": {
    "Pending": 4,
    "Approved": 18,
    "Rejected": 3,
    "Total": 25,
    "approvedLeaveDays": 42
  },
  "recentPending": [
    {
      "_id": "...",
      "studentId": {
        "personalDetails": { "firstName": "Divya", "lastName": "" },
        "academicDetails": {
          "admissionNumber": "2219",
          "class": "NUR",
          "section": "A"
        }
      },
      "fromDate": "2026-08-12T00:00:00.000Z",
      "toDate": "2026-08-14T23:59:59.999Z",
      "totalDays": 3,
      "reason": "Out of station",
      "status": "Pending",
      "createdAt": "2026-08-10T00:00:00.000Z"
    }
  ]
}
```

---

**Error Responses (All Endpoints):**

```json
{ "message": "Not authorized, no token" }                          // 401 - Missing token
{ "message": "Not authorized, token failed" }                       // 401 - Invalid token
{ "message": "Leave request not found." }                           // 404 - Wrong ID
{ "message": "Student not found." }                                 // 404 - Invalid studentId
{ "message": "studentId, fromDate, toDate, and reason are required." } // 400 - Missing fields
{ "message": "toDate cannot be before fromDate." }                  // 400 - Invalid date range
{ "message": "status must be Approved, Rejected, or Pending." }    // 400 - Invalid status
{ "message": "Internal server error message" }                      // 500 - Server error
```

---

---

# Student Promotion API Documentation

> **Base URL:** `http://localhost:5000/api/promotions`
> All endpoints require `Authorization: Bearer YOUR_TOKEN_HERE` header.
>
> **How promotion works:**
>
> 1. Call **P1** to get classes/sections for the "Promote From" dropdown
> 2. Call **P2** to fetch eligible (STUDYING) students for selected class/section
> 3. Admin selects students in the UI and clicks "Promote Selected"
> 4. Call **P3** to bulk promote — updates each student's class/section and logs history
> 5. Call **P4** or **P5** to view history / audit trail

---

## P1. Get Distinct Classes & Sections

Returns all classes and their sections that currently have STUDYING students. Use this to populate the **"Promote From"** dropdowns in the UI.

```bash
curl -X GET http://localhost:5000/api/promotions/classes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response (200):**

```json
{
  "totalClasses": 3,
  "classes": [
    {
      "class": "UKG",
      "sections": [
        { "section": "A", "count": 8 },
        { "section": "B", "count": 6 }
      ],
      "total": 14
    },
    {
      "class": "NUR",
      "sections": [{ "section": "A", "count": 10 }],
      "total": 10
    },
    {
      "class": "1",
      "sections": [
        { "section": "A", "count": 30 },
        { "section": "B", "count": 28 }
      ],
      "total": 58
    }
  ]
}
```

---

## P2. Fetch Eligible Students for Promotion

Fetch all **STUDYING** students of a given class and section. This powers the student list table shown in the screenshot. Select all or specific students for promotion.

```bash
# Fetch students of UKG - Section A
curl -X GET "http://localhost:5000/api/promotions/eligible?class=UKG&section=A" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Fetch ALL sections of a class
curl -X GET "http://localhost:5000/api/promotions/eligible?class=UKG" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response (200):**

```json
{
  "class": "UKG",
  "section": "A",
  "total": 4,
  "students": [
    {
      "_id": "STUDENT_ID_1",
      "personalDetails": {
        "firstName": "Arnav",
        "lastName": "Gupta",
        "studentPhoto": "http://localhost:5000/uploads/studentPhoto-123.jpg"
      },
      "academicDetails": {
        "admissionNumber": "1770",
        "class": "UKG",
        "section": "A",
        "rollNumber": "01",
        "currentStatus": "STUDYING"
      }
    },
    {
      "_id": "STUDENT_ID_2",
      "personalDetails": { "firstName": "Anvi", "lastName": "Maurya" },
      "academicDetails": {
        "admissionNumber": "2203",
        "class": "UKG",
        "section": "A",
        "rollNumber": "02",
        "currentStatus": "STUDYING"
      }
    },
    {
      "_id": "STUDENT_ID_3",
      "personalDetails": { "firstName": "Shanvi", "lastName": "Yadav" },
      "academicDetails": {
        "admissionNumber": "2206",
        "class": "UKG",
        "section": "A",
        "rollNumber": "03",
        "currentStatus": "STUDYING"
      }
    }
  ]
}
```

---

## P3. Promote Selected Students (Bulk)

Promote one or more selected students to a new class, section, and session. Each student's `academicDetails.class`, `academicDetails.section`, and `academicDetails.previousClass` are updated. A **PromotionHistory** record is created for every student (audit trail).

```bash
# Promote ALL selected students from UKG-A (2025-2026) → Class 1-A (2026-2027)
curl -X POST http://localhost:5000/api/promotions/promote \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "fromSession": "2025-2026",
    "fromClass":   "UKG",
    "fromSection": "A",
    "toSession":   "2026-2027",
    "toClass":     "1",
    "toSection":   "A",
    "studentIds":  [
      "STUDENT_ID_1",
      "STUDENT_ID_2",
      "STUDENT_ID_3"
    ],
    "remarks": "Annual Promotion 2026"
  }'

# Promote only selected students (partial selection — 2 out of 4)
curl -X POST http://localhost:5000/api/promotions/promote \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "fromSession": "2025-2026",
    "fromClass":   "UKG",
    "fromSection": "A",
    "toSession":   "2026-2027",
    "toClass":     "1",
    "toSection":   "B",
    "studentIds":  ["STUDENT_ID_1", "STUDENT_ID_3"],
    "remarks": ""
  }'
```

**Success Response (200):**

```json
{
  "message": "Promotion completed. 3 promoted, 0 failed.",
  "from": {
    "session": "2025-2026",
    "class": "UKG",
    "section": "A"
  },
  "to": {
    "session": "2026-2027",
    "class": "1",
    "section": "A"
  },
  "totalRequested": 3,
  "totalPromoted": 3,
  "totalFailed": 0,
  "success": [
    {
      "studentId": "STUDENT_ID_1",
      "name": "Arnav Gupta",
      "admissionNumber": "1770",
      "promotedTo": "1 A"
    },
    {
      "studentId": "STUDENT_ID_2",
      "name": "Anvi Maurya",
      "admissionNumber": "2203",
      "promotedTo": "1 A"
    },
    {
      "studentId": "STUDENT_ID_3",
      "name": "Shanvi Yadav",
      "admissionNumber": "2206",
      "promotedTo": "1 A"
    }
  ],
  "failed": []
}
```

**Partial Failure Response (200):**

```json
{
  "message": "Promotion completed. 2 promoted, 1 failed.",
  "totalPromoted": 2,
  "totalFailed": 1,
  "success": [ ... ],
  "failed": [
    { "studentId": "INVALID_ID", "reason": "Student not found" }
  ]
}
```

---

## P4. Get Promotion History Log

Get a paginated list of all promotion records. Filter by `fromClass`, `toClass`, `fromSession`, or `toSession`.

```bash
# All promotion history
curl -X GET "http://localhost:5000/api/promotions/history" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by destination session
curl -X GET "http://localhost:5000/api/promotions/history?toSession=2026-2027" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by source class
curl -X GET "http://localhost:5000/api/promotions/history?fromClass=UKG" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by destination class
curl -X GET "http://localhost:5000/api/promotions/history?toClass=1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Combine filters (UKG → Class 1, session 2025-2026 → 2026-2027)
curl -X GET "http://localhost:5000/api/promotions/history?fromClass=UKG&toClass=1&fromSession=2025-2026&toSession=2026-2027" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# With pagination
curl -X GET "http://localhost:5000/api/promotions/history?toSession=2026-2027&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response (200):**

```json
{
  "total": 3,
  "page": 1,
  "limit": 50,
  "records": [
    {
      "_id": "HISTORY_RECORD_ID",
      "studentId": {
        "_id": "STUDENT_ID_1",
        "personalDetails": { "firstName": "Arnav", "lastName": "Gupta" },
        "academicDetails": {
          "admissionNumber": "1770",
          "class": "1",
          "section": "A"
        }
      },
      "fromSession": "2025-2026",
      "fromClass": "UKG",
      "fromSection": "A",
      "fromRollNo": "01",
      "toSession": "2026-2027",
      "toClass": "1",
      "toSection": "A",
      "toRollNo": "01",
      "promotedBy": { "firstName": "Shiva", "lastName": "Mayank" },
      "promotedAt": "2026-08-09T19:00:00.000Z",
      "remarks": "Annual Promotion 2026"
    }
  ]
}
```

---

## P5. Get Student's Promotion History

Get the complete promotion journey of a specific student — all classes they have been promoted through.

```bash
curl -X GET "http://localhost:5000/api/promotions/history/student/STUDENT_OBJECT_ID" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response (200):**

```json
{
  "student": {
    "_id": "STUDENT_OBJECT_ID",
    "personalDetails": { "firstName": "Arnav", "lastName": "Gupta" },
    "academicDetails": {
      "admissionNumber": "1770",
      "class": "1",
      "section": "A",
      "rollNumber": "01"
    }
  },
  "totalPromotions": 2,
  "history": [
    {
      "_id": "HISTORY_RECORD_ID_2",
      "fromSession": "2025-2026",
      "fromClass": "UKG",
      "fromSection": "A",
      "toSession": "2026-2027",
      "toClass": "1",
      "toSection": "A",
      "promotedBy": { "firstName": "Shiva", "lastName": "Mayank" },
      "promotedAt": "2026-08-09T19:00:00.000Z",
      "remarks": "Annual Promotion 2026"
    },
    {
      "_id": "HISTORY_RECORD_ID_1",
      "fromSession": "2024-2025",
      "fromClass": "NUR",
      "fromSection": "A",
      "toSession": "2025-2026",
      "toClass": "UKG",
      "toSection": "A",
      "promotedBy": { "firstName": "Shiva", "lastName": "Mayank" },
      "promotedAt": "2025-04-01T00:00:00.000Z",
      "remarks": "Annual Promotion 2025"
    }
  ]
}
```

---

## P6. Delete Promotion History Record

Delete a specific promotion history record (for audit correction). **This does NOT revert the student's class** — use the Student Update API (`PUT /api/students/:id`) to manually fix the class if needed.

```bash
curl -X DELETE http://localhost:5000/api/promotions/history/HISTORY_RECORD_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response (200):**

```json
{
  "message": "Promotion history record deleted. Note: Student class was NOT reverted automatically.",
  "record": {
    "_id": "HISTORY_RECORD_ID",
    "fromClass": "UKG",
    "fromSection": "A",
    "toClass": "1",
    "toSection": "A",
    "fromSession": "2025-2026",
    "toSession": "2026-2027"
  }
}
```

---

**Error Responses (All Endpoints):**

```json
{ "message": "Not authorized, no token" }                                          // 401
{ "message": "Not authorized, token failed" }                                       // 401
{ "message": "Student not found." }                                                 // 404
{ "message": "Promotion history record not found." }                                // 404
{ "message": "class query param is required." }                                     // 400
{ "message": "fromClass, toClass, toSession, and studentIds[] are required." }      // 400
{ "message": "Internal server error message" }                                      // 500
```

---

# Staff Leave Management API

All Staff Leave API endpoints are protected and require a valid Admin JWT token in the `Authorization: Bearer <token>` header.

## 1. Create a Staff Leave Request

Apply for a leave on behalf of a staff member.

```bash
curl -X POST http://localhost:5000/api/staff-leaves \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "staffId": "STAFF_ID_HERE",
    "fromDate": "2026-08-10",
    "toDate": "2026-08-12",
    "reason": "Family Function"
  }'
```

## 2. Get All Staff Leave Requests

Get a list of all staff leave requests. Supports optional query filters: `status`, `fromDate`, `toDate`, `search` (name).

```bash
curl -X GET "http://localhost:5000/api/staff-leaves?status=Pending" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 3. Update Staff Leave Status

Approve, Reject, or Cancel a staff leave request. Status must be one of: `Approved`, `Rejected`, `Pending`, `Cancelled`.

```bash
curl -X PATCH http://localhost:5000/api/staff-leaves/LEAVE_ID_HERE/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "status": "Approved",
    "adminRemarks": "Enjoy the function"
  }'
```

## 4. Get Staff Leave Stats

Get summary counts of leave statuses (Pending, Approved, etc.).

```bash
curl -X GET http://localhost:5000/api/staff-leaves/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 5. Delete a Staff Leave Request

Permanently remove a leave request.

```bash
curl -X DELETE http://localhost:5000/api/staff-leaves/LEAVE_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

# Staff Attendance Management API

All Staff Attendance API endpoints are protected and require a valid Admin JWT token in the `Authorization: Bearer <token>` header.

## 1. Bulk Mark Staff Attendance

Mark or update attendance for multiple staff members on a specific date. If a record already exists, it will be updated; otherwise, it will be created (upsert).

```bash
curl -X POST http://localhost:5000/api/staff-attendance/mark \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "date": "2026-08-03",
    "department": "Mathematics",
    "records": [
      { "staffId": "STAFF_ID_1_HERE", "status": "Present", "remarks": "" },
      { "staffId": "STAFF_ID_2_HERE", "status": "Absent", "remarks": "Sick Leave" }
    ]
  }'
```

## 2. Get Staff Attendance by Department and Date

Get attendance records for a specific department (or All) on a specific date.

```bash
# Query parameters: department (optional), date (required)
curl -X GET "http://localhost:5000/api/staff-attendance?department=Mathematics&date=2026-08-03" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 3. Update Single Staff Attendance Record

Update a specific attendance record by its MongoDB `_id`.

```bash
curl -X PUT http://localhost:5000/api/staff-attendance/RECORD_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "status": "HalfDay",
    "remarks": "Left early for emergency"
  }'
```

---

# Assign Class Teacher API

All Staff API endpoints are protected and require a valid Admin JWT token in the `Authorization: Bearer <token>` header.

## 1. Bulk Assign Class Teacher

Update the assigned class and section of multiple staff members at once.

```bash
curl -X PUT http://localhost:5000/api/staffs/bulk/assign-class-teacher \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "updates": [
      { "staffId": "STAFF_ID_1_HERE", "assignedClass": "Class 9", "assignedSection": "A" },
      { "staffId": "STAFF_ID_2_HERE", "assignedClass": "Class 10", "assignedSection": "B" }
    ]
  }'
```

---

# Assignment Management API

All Assignment API endpoints are protected and require a valid Admin JWT token in the `Authorization: Bearer <token>` header.

## 1. Create an Assignment

Create a new assignment. You can upload an optional attachment.

```bash
curl -X POST http://localhost:5000/api/assignments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F 'data={
    "type": "Class Wise",
    "subject": "Mathematics",
    "class": "Class 9",
    "assignedOn": "2026-08-03",
    "hasSubmissionDate": true,
    "dueDate": "2026-08-10",
    "title": "Algebra Equations Practice",
    "description": "Please complete exercises 1 to 10.",
    "allowMultipleSubmission": false,
    "allowLateSubmission": false,
    "isActive": true
  }' \
  -F "attachment=@/path/to/worksheet.pdf"
```

## 2. Get All Assignments

Get a list of all assignments.

```bash
curl -X GET http://localhost:5000/api/assignments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 3. Get Assignment by ID

Get details of a specific assignment.

```bash
curl -X GET http://localhost:5000/api/assignments/ASSIGNMENT_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 4. Update an Assignment

Update details of a specific assignment (can also upload a new attachment to replace the old one).

```bash
curl -X PUT http://localhost:5000/api/assignments/ASSIGNMENT_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F 'data={
    "isActive": false,
    "title": "Algebra Equations Practice (Updated)"
  }' \
  -F "attachment=@/path/to/new_worksheet.pdf"
```

## 5. Delete an Assignment

Permanently remove an assignment.

```bash
curl -X DELETE http://localhost:5000/api/assignments/ASSIGNMENT_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

# Syllabus Management API Documentation

Note: Replace `YOUR_TOKEN_HERE` with the Admin JWT token.

## 1. Create a Syllabus (With File Upload)

Upload a syllabus file (PDF/Word up to 10MB) along with its details.

```bash
curl -X POST http://localhost:5000/api/syllabus \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "title=Final Term Syllabus" \
  -F "class=Class 10" \
  -F "subject=Mathematics" \
  -F "file=@/path/to/your/syllabus.pdf"
```

## 2. Get All Syllabi

Get a list of all syllabus entries. Can filter by `class` or `subject`.

```bash
curl -X GET "http://localhost:5000/api/syllabus?class=Class%2010" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 3. Download Syllabus File

Download the file for a specific syllabus record.

```bash
curl -X GET http://localhost:5000/api/syllabus/download/669f123456789abcdef01234 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  --output downloaded_syllabus.pdf
```

## 4. Delete Syllabus

Delete a syllabus record and its associated file.

```bash
curl -X DELETE http://localhost:5000/api/syllabus/669f123456789abcdef01234 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

# Message Management API Documentation

Note: Replace `YOUR_TOKEN_HERE` with the Admin JWT token.

## 1. Send a Message (With optional File Upload)

Send a message with subject, body, and recipients (array of IDs). Supports an optional attachment.

```bash
curl -X POST http://localhost:5000/api/messages \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "subject=Meeting Tomorrow" \
  -F "body=Please attend the staff meeting tomorrow at 10 AM." \
  -F "recipients[]=669f123456789abcdef01234" \
  -F "recipients[]=669f123456789abcdef01235" \
  -F "attachment=@/path/to/your/document.pdf"
```

_(Note: Omit the `-F "attachment=..."` line if sending without a file)._

## 2. Get Sent Messages (Sentbox)

Get a list of all messages sent by the logged-in user.

```bash
curl -X GET http://localhost:5000/api/messages/sent \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 3. Get Received Messages (Inbox)

Get a list of all messages where the logged-in user is a recipient.

```bash
curl -X GET http://localhost:5000/api/messages/inbox \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 4. Get Message by ID

Read a specific message (marks it as read if the current user is a recipient).

```bash
curl -X GET http://localhost:5000/api/messages/669f123456789abcdef01234 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 5. Delete Message

Delete a sent message by ID (only the sender can delete it).

```bash
curl -X DELETE http://localhost:5000/api/messages/669f123456789abcdef01234 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

# Specified Message & Template API Documentation

Note: Replace `YOUR_TOKEN_HERE` with the Admin JWT token.

## 1. Get Contacts for Specified Message

Fetch a list of contacts (students and parent details) for a specific class to display in the table.

```bash
curl -X GET "http://localhost:5000/api/specified-messages/contacts?class=Class%2010" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 2. Send Specified Message (With optional File Upload)

Send a bulk message to selected contacts.

```bash
curl -X POST http://localhost:5000/api/specified-messages/send \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "subject=Fee Reminder" \
  -F "body=Please pay your due fees by the end of the week." \
  -F "sendToClass=Class 10" \
  -F "recipients[]=669f123456789abcdef01234" \
  -F "attachment=@/path/to/your/notice.pdf"
```

## 3. Create a Message Template

Create a reusable message template.

```bash
curl -X POST http://localhost:5000/api/specified-messages/templates \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Fee Reminder",
    "body": "Please pay your due fees by the end of the week."
  }'
```

## 4. Get All Message Templates

Fetch all saved message templates to show in the dropdown.

```bash
curl -X GET http://localhost:5000/api/specified-messages/templates \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 5. Delete a Message Template

Delete a message template by ID.

```bash
curl -X DELETE http://localhost:5000/api/specified-messages/templates/669f123456789abcdef01234 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

````

---

# School Notice API Documentation

Note: Replace `YOUR_TOKEN_HERE` with the Admin JWT token.

## 1. Create Notice
Create a new notice for the school.
```bash
curl -X POST http://localhost:5000/api/notices \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "heading": "Holiday Extended",
    "description": "School will remain closed till 05-Jan-2024 due to cold wave."
  }'
```

## 2. Get All Notices (With Search)
Fetch the list of notices. Optionally use `?search=` to filter by heading or description. The response includes a `status` (Read/Unread) for the logged-in user.
```bash
curl -X GET "http://localhost:5000/api/notices?search=Holiday" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 3. View Notice by ID (Marks as Read)
Fetch a single notice. This action automatically marks the notice as "Read" for the current user.
```bash
curl -X GET http://localhost:5000/api/notices/669f123456789abcdef01234 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 4. Update Notice
Update an existing notice.
```bash
curl -X PUT http://localhost:5000/api/notices/669f123456789abcdef01234 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "heading": "Holiday Extended (Updated)",
    "description": "School will remain closed till 07-Jan-2024."
  }'
```


## 5. Delete Notice
Delete a notice from the system.
```bash
curl -X DELETE http://localhost:5000/api/notices/669f123456789abcdef01234 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
````

---

# Class Notice API Documentation

Note: Replace `YOUR_TOKEN_HERE` with the Admin JWT token.

## 1. Create Class Notice

Create a new notice for a specific class (and optionally section).

```bash
curl -X POST http://localhost:5000/api/class-notices \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "class": "NUR",
    "section": "A",
    "heading": "Rhymes Competition",
    "description": "Annual rhymes competition will be held next week..."
  }'
```

## 2. Get All Class Notices (Filtered)

Fetch notices by class/section. Optionally use `?search=` to filter by heading or description. Returns Read/Unread status.

```bash
curl -X GET "http://localhost:5000/api/class-notices?class=NUR&section=A" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 3. View Class Notice by ID (Marks as Read)

Fetch a single class notice. Automatically marks it as "Read" for the current user.

```bash
curl -X GET http://localhost:5000/api/class-notices/669f123456789abcdef01234 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 4. Update Class Notice

Update an existing class notice.

```bash
curl -X PUT http://localhost:5000/api/class-notices/669f123456789abcdef01234 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "heading": "Rhymes Competition (Updated)",
    "description": "The competition is postponed to next month."
  }'
```

## 5. Delete Class Notice

Delete a class notice from the system.

```bash
curl -X DELETE http://localhost:5000/api/class-notices/669f123456789abcdef01234 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

````

---

# Staff Notice API Documentation

Note: Replace `YOUR_TOKEN_HERE` with the Admin/Staff JWT token.

## 1. Create Staff Notice
Create a new notice for staff members.
```bash
curl -X POST http://localhost:5000/api/staff-notices \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "heading": "Staff Meeting",
    "description": "Urgent staff meeting in the main hall at 2 PM."
  }'
```

## 2. Get All Staff Notices
Fetch staff notices. Optionally use `?search=` to filter by heading or description. Returns Read/Unread status based on the current user.
```bash
curl -X GET "http://localhost:5000/api/staff-notices?search=Meeting" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 3. View Staff Notice by ID (Marks as Read)
Fetch a single staff notice. Automatically marks it as "Read" for the current user.
```bash
curl -X GET http://localhost:5000/api/staff-notices/669f123456789abcdef01234 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 4. Update Staff Notice
Update an existing staff notice.
```bash
curl -X PUT http://localhost:5000/api/staff-notices/669f123456789abcdef01234 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "heading": "Staff Meeting (Rescheduled)",
    "description": "The meeting is moved to 4 PM."
  }'
```

## 5. Delete Staff Notice
Delete a staff notice from the system.
```bash
curl -X DELETE http://localhost:5000/api/staff-notices/669f123456789abcdef01234 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
````

---

# Timetable Management API

All Timetable API endpoints are protected and require a valid Admin JWT token in the `Authorization: Bearer <token>` header.

## 1. Upsert Timetable (Create or Update)

Save or update the timetable for a specific class and section. This endpoint completely replaces the existing schedule for the class/section.

```bash
curl -X POST http://localhost:5000/api/timetables \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "class": "Class 10",
    "section": "A",
    "schedule": [
      {
        "day": "Monday",
        "periods": [
          {
            "periodName": "1st Period",
            "startTime": "08:00 AM",
            "endTime": "08:45 AM",
            "isBreak": false,
            "subject": "Mathematics",
            "teacher": "STAFF_ID_HERE"
          },
          {
            "periodName": "Break",
            "startTime": "10:15 AM",
            "endTime": "10:45 AM",
            "isBreak": true,
            "subject": "",
            "teacher": null
          }
        ]
      }
    ]
  }'
```

## 2. Get Timetable

Fetch the timetable for a specific class and section.

```bash
curl -X GET "http://localhost:5000/api/timetables?class=Class%2010&section=A" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 3. Delete Timetable

Delete the timetable for a specific class and section.

```bash
curl -X DELETE "http://localhost:5000/api/timetables?class=Class%2010&section=A" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

````

---

# Circulars API (`/api/circulars`)

## 1. Create a Circular
Create a new circular. Use `multipart/form-data` if you are uploading a file. Otherwise, you can use JSON.

```bash
curl -X POST http://localhost:5000/api/circulars \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "title=Exam Schedule 2026" \
  -F "date=2026-08-20" \
  -F "details=Please find the attached exam schedule." \
  -F "sendTo=All User" \
  -F "mustRead=true" \
  -F "isActive=true" \
  -F "session=2026-2027" \
  -F "file=@/path/to/your/file.pdf"
```

## 2. Get All Circulars
Fetch all circulars. Optionally filter by session or search by title.

```bash
curl -X GET "http://localhost:5000/api/circulars?session=2026-2027&search=Exam" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 3. Get Circular by ID
Fetch a single circular by its ID.

```bash
curl -X GET http://localhost:5000/api/circulars/669f123456789abcdef01234 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 4. Update a Circular
Update an existing circular by its ID. Supports `multipart/form-data` for file updates.

```bash
curl -X PUT http://localhost:5000/api/circulars/669f123456789abcdef01234 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "title=Updated Exam Schedule" \
  -F "file=@/path/to/your/newfile.pdf"
```

## 5. Delete a Circular
Delete a circular by its ID.

```bash
curl -X DELETE http://localhost:5000/api/circulars/669f123456789abcdef01234 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

# SMS Management API (`/api/sms`)

## 1. Send SMS
Send an SMS and log it into the database.

```bash
curl -X POST http://localhost:5000/api/sms \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Class Test SMS",
    "language": "ENGLISH",
    "message": "Dear Student, your class test is scheduled on Monday.",
    "sendCopy": true,
    "sendTo": "Student"
  }'
```

## 2. Get All SMS Logs
Fetch all sent SMS logs.

```bash
curl -X GET "http://localhost:5000/api/sms?sendTo=Student" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 3. Delete SMS Log
Delete an SMS log.

```bash
curl -X DELETE http://localhost:5000/api/sms/669f123456789abcdef01234 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

# SMS Templates API (`/api/sms/templates`)

## 1. Create SMS Template
Create a new SMS template.

```bash
curl -X POST http://localhost:5000/api/sms/templates \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Class Test SMS",
    "message": "Dear S____, your test is scheduled on ____."
  }'
```

## 2. Get SMS Templates
Fetch templates. Optionally pass `?subject=Class Test SMS` to filter.

```bash
curl -X GET "http://localhost:5000/api/sms/templates?subject=Class%20Test%20SMS" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 3. Update SMS Template
Update an SMS template.

```bash
curl -X PUT http://localhost:5000/api/sms/templates/669f123456789abcdef01234 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Class Test SMS",
    "message": "Dear S____, your test is rescheduled."
  }'
```

## 4. Delete SMS Template
Delete a template.

```bash
curl -X DELETE http://localhost:5000/api/sms/templates/669f123456789abcdef01234 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

# Specified SMS API (`/api/specified-sms`)

## 1. Send Specified SMS
Send a specified SMS to targeted contacts and log it into the database.

```bash
curl -X POST http://localhost:5000/api/specified-sms \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "smsType": "Attendance",
    "message": "Dear Parent, your child is absent today.",
    "sendCopy": false,
    "date": "2026-08-15",
    "recipients": ["669f123456789abcdef01234", "669f123456789abcdef01235"]
  }'
```

## 2. Get All Specified SMS Logs
Fetch all sent specified SMS logs. Optionally filter by `smsType`.

```bash
curl -X GET "http://localhost:5000/api/specified-sms?smsType=Attendance" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 3. Get Specified SMS by ID
Fetch a single specified SMS log by ID.

```bash
curl -X GET http://localhost:5000/api/specified-sms/669f123456789abcdef01234 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 4. Delete Specified SMS Log
Delete a specified SMS log.

```bash
curl -X DELETE http://localhost:5000/api/specified-sms/669f123456789abcdef01234 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

# Credentials Management API (`/api/credentials`)

## 1. Send Credentials
Send login credentials via SMS or Email to specified user types (e.g., Student, Parent, Staff).

```bash
curl -X POST http://localhost:5000/api/credentials/send \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "sendVia": "SMS",
    "sendToType": "Student",
    "recipients": ["669f123456789abcdef01234", "669f123456789abcdef01235"]
  }'
```
> Note: `recipients` is an array of IDs representing the users who are receiving the credentials.

## 2. Get Credential Logs
Fetch the logs of dispatched credentials.

```bash
curl -X GET http://localhost:5000/api/credentials/logs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

# Teacher Observation API (`/api/teacher-observations`)

## 1. Create Teacher Observation
Record an observation for a staff member.

```bash
curl -X POST http://localhost:5000/api/teacher-observations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "staff": "669f123456789abcdef01234",
    "observationDate": "2026-08-20",
    "subject": "Mathematics",
    "topic": "Algebra",
    "remarks": "Excellent class control and interaction.",
    "rating": 5
  }'
```

## 2. Get All Observations
Fetch all teacher observations.

```bash
curl -X GET http://localhost:5000/api/teacher-observations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 3. Get Observations by Staff ID
Fetch observations specific to one staff member.

```bash
curl -X GET http://localhost:5000/api/teacher-observations/staff/669f123456789abcdef01234 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 4. Get Observation by ID
Fetch a single observation record.

```bash
curl -X GET http://localhost:5000/api/teacher-observations/669f123456789abcdef01234 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 5. Update Observation
Update an existing observation.

```bash
curl -X PUT http://localhost:5000/api/teacher-observations/669f123456789abcdef01234 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "remarks": "Updated remarks."
  }'
```

## 6. Delete Observation
Delete an observation log.

```bash
curl -X DELETE http://localhost:5000/api/teacher-observations/669f123456789abcdef01234 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Teacher Observations

### Get Observation Report
Fetch the observation report for teachers based on date range or specific teacher.

```bash
curl -X GET 'http://localhost:5000/api/teacher-observations/report?fromDate=2023-10-01&toDate=2023-10-31' \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

## My Attendance

### Get Staff My Attendance
Fetch the attendance report for a specific staff member for a given month and year.

```bash
curl -X GET 'http://localhost:5000/api/staff-attendance/my-attendance?staffId=STAFF_ID_HERE&month=10&year=2023' \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Get Student My Attendance
Fetch the attendance report for a specific student for a given month and year.

```bash
curl -X GET 'http://localhost:5000/api/attendance/my-attendance?studentId=STUDENT_ID_HERE&month=10&year=2023' \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

## My Leave

### Apply Leave (Staff)
Apply for a new leave request.

```bash
curl -X POST 'http://localhost:5000/api/staff-leaves' \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "staffId": "STAFF_ID_HERE",
    "leaveType": "Sick Leave",
    "fromDate": "2023-10-10",
    "toDate": "2023-10-11",
    "reason": "Feeling unwell"
  }'
```

### Get Staff My Leaves
Fetch the leave history for a specific staff member.

```bash
curl -X GET 'http://localhost:5000/api/staff-leaves/my-leaves?staffId=STAFF_ID_HERE' \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Apply Leave (Student)
Apply for a new leave request.

```bash
curl -X POST 'http://localhost:5000/api/leave-requests' \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "STUDENT_ID_HERE",
    "leaveType": "Casual Leave",
    "fromDate": "2023-10-15",
    "toDate": "2023-10-16",
    "reason": "Family function"
  }'
```

### Get Student My Leaves
Fetch the leave history for a specific student.

```bash
curl -X GET 'http://localhost:5000/api/leave-requests/my-leaves?studentId=STUDENT_ID_HERE' \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

## My Pending Tasks

### Create Task
Create a new task assigned to a user.

```bash
curl -X POST 'http://localhost:5000/api/tasks' \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "assignedTo": "USER_ID_HERE",
    "taskDescription": "Submit quarterly report",
    "type": "Task",
    "dueDate": "2023-10-25"
  }'
```

### Get My Pending Tasks
Fetch the pending and overdue tasks for a specific user.

```bash
curl -X GET 'http://localhost:5000/api/tasks/my-tasks?userId=USER_ID_HERE' \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Mark Task Done
Mark a specific task as Done.

```bash
curl -X PATCH 'http://localhost:5000/api/tasks/TASK_ID_HERE/done' \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

## My Payslip

### Generate Payslip
Generate a new payslip for a staff member for a specific month and year.

```bash
curl -X POST 'http://localhost:5000/api/payslips' \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "staffId": "STAFF_ID_HERE",
    "month": "October",
    "year": 2023,
    "earnings": {
      "basicPay": 45000,
      "houseRentAllowance": 8000,
      "conveyanceAllowance": 2000,
      "medicalAllowance": 1500
    },
    "deductions": {
      "providentFund": 3500,
      "professionalTax": 200,
      "incomeTax": 1800
    }
  }'
```

### Get My Payslip
Fetch the generated payslip details for a specific staff, month, and year.

```bash
curl -X GET 'http://localhost:5000/api/payslips/my-payslip?staffId=STAFF_ID_HERE&month=October&year=2023' \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

## Library Management

### Add Book
Add a new book to the library.

```bash
curl -X POST 'http://localhost:5000/api/books' \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "accNo": "LIB-001",
    "title": "Introduction to Algorithms",
    "author": "Thomas H. Cormen",
    "category": "Computer Science"
  }'
```

### Get All Books
Fetch all books in the library. Supports filtering by status (Available/Issued) and searching (title/author/accNo).

```bash
curl -X GET 'http://localhost:5000/api/books?status=Available&search=Algorithms' \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Request Book
Request a specific available book.

```bash
curl -X PATCH 'http://localhost:5000/api/books/BOOK_ID_HERE/request' \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

## E-Books Library

### Add E-Book
Add a new e-book to the library.

```bash
curl -X POST 'http://localhost:5000/api/ebooks' \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F 'title=Physics Fundamentals' \
  -F 'author=NCERT' \
  -F 'className=Class 10' \
  -F 'subject=Physics' \
  -F 'pdfFile=@/path/to/physics10.pdf'
```

### Get All E-Books
Fetch all e-books. Supports filtering by subject/class and searching by title/author.

```bash
curl -X GET 'http://localhost:5000/api/ebooks?subject=Physics' \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

## Activities

### Add New Activity
Create a new school activity or event.

```bash
curl -X POST 'http://localhost:5000/api/activities' \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Annual Sports Day",
    "dayType": "Full Day",
    "duration": "1 Day",
    "fromDate": "2023-11-15",
    "assignTo": "All Students",
    "isActive": true,
    "showOnWebsite": true
  }'
```

### Get All Activities
Fetch the list of all activities.

```bash
curl -X GET 'http://localhost:5000/api/activities' \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

## Questionnaire Management

### Create New Questionnaire
Create a new survey or questionnaire.

```bash
curl -X POST 'http://localhost:5000/api/questionnaires' \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Student Feedback Survey",
    "targetAudience": "Students",
    "status": "Active"
  }'
```

### Get All Questionnaires
Fetch the list of all questionnaires.

```bash
curl -X GET 'http://localhost:5000/api/questionnaires' \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Update Questionnaire
Update an existing questionnaire (e.g., change status to Closed).

```bash
curl -X PUT 'http://localhost:5000/api/questionnaires/QUESTIONNAIRE_ID_HERE' \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Closed"
  }'
```

### Delete Questionnaire
Delete an existing questionnaire.

```bash
curl -X DELETE 'http://localhost:5000/api/questionnaires/QUESTIONNAIRE_ID_HERE' \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```
