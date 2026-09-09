---

# Possible Siblings API Documentation

This document contains the cURL commands to test the **Possible Siblings** APIs. 
*Note: Sibling relations are managed within the `Student` module by updating the `familyDetails.familyId` field.*

The base URL is `http://localhost:5000`.

## 1. Get Possible Siblings
**GET** `/api/students/possible-siblings`

Fetches all students grouped by identical Father Name, Mother Name, and Contact Number where the group has more than 1 student.

```bash
# Note: Ensure you pass your valid Bearer token for authentication
curl -X GET http://localhost:5000/api/students/possible-siblings \
-H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 2. Save Siblings (Link/Unlink)
**POST** `/api/students/save-siblings`

Use this API when the user clicks the "Save Sibling" button.
Pass the IDs of students selected under "Select to Add" to `studentIdsToLink`. 
Pass the IDs of students selected under "Select to Remove" to `studentIdsToUnlink`.

```bash
curl -X POST http://localhost:5000/api/students/save-siblings \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_TOKEN_HERE" \
-d '{
  "studentIdsToLink": ["64c7d0b3f1e582a1a8c9b2d0", "64c7d0b3f1e582a1a8c9b2d1"],
  "studentIdsToUnlink": []
}'
```

---
**How it works backend-side:**
1. Linking assigns a single, unified `familyId` (under `familyDetails.familyId`) to all provided `studentIdsToLink`.
2. Unlinking clears the `familyId` from `studentIdsToUnlink`.
