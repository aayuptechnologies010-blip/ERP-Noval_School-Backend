---

# Define Prospectus & Registration No Setting API Documentation

This document contains the cURL commands to test the **Prospectus & Registration No Setting** APIs.
The base URL is `http://localhost:5000`.

## 1. Get Dropdown Options
**GET** `/api/registration-no-settings/options`

This API dynamically fetches all available Schools, Classes, Sessions, and Boards to populate the top filter dropdowns.

```bash
curl -X GET http://localhost:5000/api/registration-no-settings/options
```

## 2. Get Setting For Specific Combination
**GET** `/api/registration-no-settings`

Fetches the saved settings based on the selected dimensions. This is required because the settings vary per School + Class + Session + Board + Setting Type (e.g., "Registration No.").

_(Replace the placeholder IDs in the URL with actual `_id` values from the options API)_

```bash
curl -X GET "http://localhost:5000/api/registration-no-settings?school=SCHOOL_ID&classId=CLASS_ID&session=SESSION_ID&board=BOARD_ID&settingFor=Registration%20No."
```

## 3. Save / Update Settings
**POST** `/api/registration-no-settings`

Creates a new setting if it does not exist for the selected combination, or updates it if it already exists.

_(Replace the placeholder IDs with actual `_id` values)_

```bash
curl -X POST http://localhost:5000/api/registration-no-settings \
-H "Content-Type: application/json" \
-d '{
  "school": "SCHOOL_ID",
  "classId": "CLASS_ID",
  "session": "SESSION_ID",
  "board": "BOARD_ID",
  "settingFor": "Registration No.",
  "settingType": "Automatic",
  "recNoStartFrom": 1,
  "prefix": "REG-",
  "startFrom": 1,
  "leadZero": 4,
  "suffix": "-26"
}'
```

### Notes
- `settingType` accepts enum values: `"Automatic"`, `"Manual"`.
- The combination of (`school`, `class`, `session`, `board`, `settingFor`) is strictly unique in the database to prevent duplicate settings.
