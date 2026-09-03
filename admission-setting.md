---

# Define Admission Setting API Documentation

This document contains the cURL commands to test the **Admission Setting** APIs.
The base URL is `http://localhost:5000`.

## 1. Get Admission Settings
**GET** `/api/admission-settings`

Fetches the global admission default settings (like default session, default paymode, and toggle configurations). If no settings exist yet, the API will generate and return default values automatically.

```bash
curl -X GET http://localhost:5000/api/admission-settings
```

## 2. Update Admission Settings
**PUT** `/api/admission-settings`

Dynamically updates the admission settings. You can pass only the fields you wish to update, and the API will merge them into the existing document.

```bash
curl -X PUT http://localhost:5000/api/admission-settings \
-H "Content-Type: application/json" \
-d '{
  "defaultSession": "64c8d5c9e4b0a1a2b3c4d5e6",
  "defaultPaymode": "Cash",
  "amountOnFormEntry": 200,
  "isValidateStationaryOnProspectusEntry": true,
  "sendSmsAfterEnquiry": false,
  "sendSmsAfterAdmissionFormRegistration": true,
  "sendSmsAfterProspectus": false,
  "isAutoRollNo": true,
  "generateTcBoardWise": false,
  "areYouWantToFixSession": true,
  "registrationAndProspectusNoSame": false,
  "registrationAndProspectusReceiptNoSame": true,
  "importRegistrationWithProspectus": true,
  "areYouWantPrintOutAfterProspectusEntry": false,
  "areYouWantUpdateAdmNoFromRegistration": true,
  "sendCredentialSmsAfterStudentRegistration": true,
  "sendSmsMailAfterStudentRegistration": "BOTH",
  "byDefaultGender": "Male",
  "areYouWantToCheckDuplicateStudentOnRegistration": true,
  "autoFillStudentHouseInformation": false,
  "checkLibraryBookDefaulterForInactiveStudent": false,
  "usernameAsAdmissionNoAndPasswordAsStudentDob": true
}'
```

### Note
- `sendSmsMailAfterStudentRegistration` enum options: `'SMS'`, `'MAIL'`, `'BOTH'`, `'NONE'`.
- `byDefaultGender` enum options: `'Male'`, `'Female'`, `'Other'`.
- All boolean toggles default to `false` except for a few standard ones. 
- You do not need to send all fields during a `PUT` request; any missing fields will remain unchanged in the database.
