---

# Report Layout Setting API Documentation

This document contains the cURL commands to test the **Report Layout Setting** APIs.
The base URL is `http://localhost:5000`.

## 1. Create a New Report Layout Setting
**POST** `/api/report-layout-settings`

Use this endpoint when creating a new report layout setting. You can also use this for the **Copy Report Setting** feature from the UI by taking an existing report layout, changing its `reportName`, and sending it here.

```bash
curl -X POST http://localhost:5000/api/report-layout-settings \
-H "Content-Type: application/json" \
-d '{
  "reportName": "Student Fee Receipt",
  "reportTitle": "Fee Receipt 2026-27",
  "pageOrientation": "Portrait",
  "pageLayout": "A4",
  "pageHeight": 11.69,
  "pageWidth": 8.27,
  "headerHeight": 2,
  "footerHeight": 1,
  "logoHeight": 1.5,
  "pageMarginLeft": 0.5,
  "isHeaderEnable": true,
  "isFooterEnable": true,
  "isLogoEnable": true,
  "fontSize": 12,
  "isTotal": "Yes"
}'
```

## 2. Get All Report Layout Settings
**GET** `/api/report-layout-settings`

Use this API to populate the "Copy From" dropdown.

```bash
curl -X GET http://localhost:5000/api/report-layout-settings
```

## 3. Get Report Layout Setting by ID
**GET** `/api/report-layout-settings/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X GET http://localhost:5000/api/report-layout-settings/:id
```

## 4. Update Report Layout Setting
**PUT** `/api/report-layout-settings/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X PUT http://localhost:5000/api/report-layout-settings/:id \
-H "Content-Type: application/json" \
-d '{
  "reportTitle": "Updated Fee Receipt 2026-27",
  "fontSize": 14
}'
```

## 5. Delete Report Layout Setting
**DELETE** `/api/report-layout-settings/:id`

_(Replace `:id` with an actual ID)_

```bash
curl -X DELETE http://localhost:5000/api/report-layout-settings/:id
```
