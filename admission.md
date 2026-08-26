# Admission Manager - Define Profession API Documentation

This document contains the APIs required for managing "Professions" under the Admission Manager module.
These APIs are used to populate and manage the Profession dropdown list (e.g., ADVOCAT, ARCHITECT, BANK EMPLOYEE) during student admission.

> **Note:** All these APIs require an authentication token (`Bearer YOUR_TOKEN_HERE`).

---

## 1. Create a New Profession (POST /api/professions)

Used to add a new profession to the list.

```bash
curl -X POST http://localhost:5000/api/professions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "SOFTWARE ENGINEER"
  }'
```

---

## 2. Get All Professions (GET /api/professions)

Fetches a list of all defined professions. Useful for displaying the table and the dropdown menu.

```bash
curl -X GET http://localhost:5000/api/professions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 3. Update a Profession (PUT /api/professions/:id)

Used to edit an existing profession (e.g., correcting a typo).

```bash
curl -X PUT http://localhost:5000/api/professions/PROFESSION_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "SOFTWARE DEVELOPER"
  }'
```

---

## 4. Delete a Profession (DELETE /api/professions/:id)

Deletes a profession from the list.

```bash
curl -X DELETE http://localhost:5000/api/professions/PROFESSION_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 5. Create an Academic Year (POST /api/academic-years)

Used to add a new academic year to the system.

```bash
curl -X POST http://localhost:5000/api/academic-years \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "2026-2027",
    "startDate": "2026-04-01",
    "endDate": "2027-03-31",
    "isActive": true
  }'
```

---

## 6. Get All Academic Years (GET /api/academic-years)

Fetches a list of all defined academic years. The list is sorted by start date.

```bash
curl -X GET http://localhost:5000/api/academic-years \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 7. Update an Academic Year (PUT /api/academic-years/:id)

Used to edit an existing academic year. If `isActive` is set to `true`, the system automatically sets all other academic years to `false`.

```bash
curl -X PUT http://localhost:5000/api/academic-years/ACADEMIC_YEAR_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "2026-2027",
    "isActive": true
  }'
```

---

## 8. Delete an Academic Year (DELETE /api/academic-years/:id)

Deletes an academic year from the list. Note that the system prevents deleting an actively running academic year (`isActive: true`).

```bash
curl -X DELETE http://localhost:5000/api/academic-years/ACADEMIC_YEAR_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

---

## 9. Create a Financial Year (POST /api/financial-years)

Used to add a new financial year to the system.

```bash
curl -X POST http://localhost:5000/api/financial-years \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "2026-2027",
    "startDate": "2026-04-01",
    "endDate": "2027-03-31",
    "isActive": true
  }'
```

---

## 10. Get All Financial Years (GET /api/financial-years)

Fetches a list of all defined financial years. The list is sorted by start date.

```bash
curl -X GET http://localhost:5000/api/financial-years \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 11. Update a Financial Year (PUT /api/financial-years/:id)

Used to edit an existing financial year. If `isActive` is set to `true`, the system automatically sets all other financial years to `false`.

```bash
curl -X PUT http://localhost:5000/api/financial-years/FINANCIAL_YEAR_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "2026-2027",
    "isActive": true
  }'
```

---

## 12. Delete a Financial Year (DELETE /api/financial-years/:id)

Deletes a financial year from the list. Note that the system prevents deleting an actively running financial year (`isActive: true`).

```bash
curl -X DELETE http://localhost:5000/api/financial-years/FINANCIAL_YEAR_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
