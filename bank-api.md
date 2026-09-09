---

# Bank API Documentation

This document contains the cURL commands to test the **Bank** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New Bank
**POST** `/api/banks`

Use this API when the user clicks the "Save" button on the Add New Bank modal.

```bash
curl -X POST http://localhost:5000/api/banks \
  -H "Content-Type: application/json" \
  -d '{
    "bankName": "State Bank of India",
    "accountNumber": "12345678901",
    "mobile": "9876543210",
    "address": "Main Branch, City Center",
    "ifscCode": "SBIN0001234",
    "bsrCode": "0001234",
    "isSchool": true
  }'
```

## 2. Get All Banks
**GET** `/api/banks`

Use this API to populate the datatable in the "Define Bank" panel.

```bash
curl -X GET http://localhost:5000/api/banks
```

## 3. Get Bank by ID
**GET** `/api/banks/:id`

Use this API to fetch a specific bank's details, e.g., when editing.

```bash
curl -X GET http://localhost:5000/api/banks/BANK_ID_HERE
```

## 4. Update a Bank
**PUT** `/api/banks/:id`

Use this API when the user edits an existing bank and saves it.

```bash
curl -X PUT http://localhost:5000/api/banks/BANK_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "bankName": "State Bank of India (Updated)",
    "ifscCode": "SBIN0009999"
  }'
```

## 5. Delete a Bank
**DELETE** `/api/banks/:id`

Use this API when the user clicks the delete action on the datatable.

```bash
curl -X DELETE http://localhost:5000/api/banks/BANK_ID_HERE
```
