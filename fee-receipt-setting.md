---

# Fee Receipt Number Setting API Documentation

This document contains the cURL commands to test the **Fee Receipt Number Setting** APIs.
The base URL is `http://localhost:5000`.

**Note:** All these APIs are protected and require a Bearer token in the `Authorization` header.

## 1. Get Fee Receipt Settings
**GET** `/api/fee-receipt-settings`

Use this API when the user opens the "Fee Receipt Number Setting" panel to pre-fill the form with the saved settings. If no setting is found, it will return a default `Single Receipt` object.

```bash
curl -X GET http://localhost:5000/api/fee-receipt-settings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 2. Update Fee Receipt Settings
**POST** `/api/fee-receipt-settings`

Use this API when the user clicks the **Update** button. The payload will change dynamically based on the selected radio button.

### Example A: Single Receipt
```bash
curl -X POST http://localhost:5000/api/fee-receipt-settings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "receiptType": "Single Receipt",
    "settings": [
      {
        "prefix": "RCPT",
        "leadZero": 4,
        "rcptNoStart": 1,
        "suffix": "2026"
      }
    ]
  }'
```

### Example B: School Wise Receipt
```bash
curl -X POST http://localhost:5000/api/fee-receipt-settings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "receiptType": "School Wise Receipt",
    "settings": [
      {
        "schoolId": "65b4c3e1a2d3b40012345678",
        "prefix": "SCHA",
        "leadZero": 3,
        "rcptNoStart": 100,
        "suffix": ""
      },
      {
        "schoolId": "65b4c3e1a2d3b40012345679",
        "prefix": "SCHB",
        "leadZero": 3,
        "rcptNoStart": 1,
        "suffix": ""
      }
    ]
  }'
```

### Example C: Feetype Wise Receipt
```bash
curl -X POST http://localhost:5000/api/fee-receipt-settings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "receiptType": "Feetype Wise Receipt",
    "settings": [
      {
        "feeTypeId": "65b4c3e1a2d3b40012345680",
        "prefix": "TUIT",
        "leadZero": 5,
        "rcptNoStart": 1,
        "suffix": ""
      }
    ]
  }'
```

### Example D: School with Feetype Wise Receipt
```bash
curl -X POST http://localhost:5000/api/fee-receipt-settings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "receiptType": "School with Feetype Wise Receipt",
    "settings": [
      {
        "schoolId": "65b4c3e1a2d3b40012345678",
        "feeTypeId": "65b4c3e1a2d3b40012345680",
        "prefix": "SCH-TUIT",
        "leadZero": 4,
        "rcptNoStart": 1,
        "suffix": ""
      }
    ]
  }'
```

### Example E: Bank Wise Receipt
```bash
curl -X POST http://localhost:5000/api/fee-receipt-settings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "receiptType": "Bank Wise Receipt",
    "settings": [
      {
        "bankId": "65b4c3e1a2d3b40012345690",
        "prefix": "SBI",
        "leadZero": 3,
        "rcptNoStart": 1,
        "suffix": ""
      }
    ]
  }'
```
