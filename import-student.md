---

# Define Import Student API Documentation

This document contains the cURL commands to test the **Import Student** API.
The base URL is `http://localhost:5000`.

## 1. Import Students from Excel
**POST** `/api/students/import`

This endpoint accepts an excel file (`.xlsx`, `.xls`, `.csv`) and an optional `uploadOption` (e.g., 'current' or 'multiple' academic year).

_(Replace `/path/to/your/students.xlsx` with the actual path to your Excel file)_

```bash
curl -X POST http://localhost:5000/api/students/import \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@/path/to/your/students.xlsx" \
  -F "uploadOption=current"
```

### Notes
- The Excel file should contain headers like `First Name`, `Last Name`, `Admission Number`, `Class`, `Section`, `Gender`, `Mobile`, etc.
- The `Authorization` header is required because this route uses the `protect` middleware.
- If duplicate Admission Numbers are found, the API will still insert the non-duplicates and return a 200 OK with a message indicating some were skipped.
