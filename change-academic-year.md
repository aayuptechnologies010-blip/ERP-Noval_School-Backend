---

# Define Change Academic Year API Documentation

This document contains the cURL commands to test the **Change Academic Year** APIs.
The base URL is `http://localhost:5000`.

## 1. Get Dropdown Options
**GET** `/api/change-academic-year/options`

This API is dynamic and fetches all the available Academic Years, Financial Years, and Schools directly from their respective database collections to populate the dropdowns.

```bash
curl -X GET http://localhost:5000/api/change-academic-year/options
```

## 2. Change Academic Year Globally
**POST** `/api/change-academic-year`

This updates the `isActive` flag for the selected Academic Year and Financial Year, and the `isMainSchool` flag for the selected School, setting all others to false.

_(Replace the IDs with actual `_id` values from the options API response)_

```bash
curl -X POST http://localhost:5000/api/change-academic-year \
-H "Content-Type: application/json" \
-d '{
  "academicYearId": "64c8d5c9e4b0a1a2b3c4d5e6",
  "financialYearId": "64c8d5f1e4b0a1a2b3c4d5e7",
  "schoolId": "64c8d60ae4b0a1a2b3c4d5e8"
}'
```

### Notes
- `academicYearId`, `financialYearId`, and `schoolId` are **required**.
- The API will ensure only the passed items remain marked as active globally.
