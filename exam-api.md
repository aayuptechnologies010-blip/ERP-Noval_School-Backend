# Examination & Result Management API Documentation

This module manages exam scheduling and student academic results. 

> **Note:** All APIs require an authentication token (`Bearer YOUR_TOKEN_HERE`).

---

## 1. Schedule New Exam (POST /api/exams)
Create a new examination schedule.

```bash
curl -X POST http://localhost:5000/api/exams \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "examName": "Half Yearly",
    "term": "Term 1",
    "startDate": "2026-09-10",
    "endDate": "2026-09-25",
    "applicableClasses": ["10", "11", "12"],
    "remarks": "Bring admit cards"
  }'
```
*(Use the `_id` from the response as `EXAM_ID` below)*

---

## 2. Get All Exams (GET /api/exams)
Fetch all exams. Can filter by `className` or `status` (Upcoming, Ongoing, Completed). The status automatically updates based on the current date.

```bash
# Fetch exams for Class 10
curl -X GET "http://localhost:5000/api/exams?className=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 3. Enter Student Marks/Result (POST /api/results)
Enter marks for a specific student, exam, and subject. If a result for this combination already exists, it will **update** it.

```bash
curl -X POST http://localhost:5000/api/results \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "STUDENT_ID_HERE",
    "examId": "EXAM_ID_HERE",
    "subject": "Mathematics",
    "maxMarks": 100,
    "marksObtained": 85,
    "grade": "A",
    "remarks": "Excellent work"
  }'
```

---

## 4. Get Student's Report Card (GET /api/results/student/:studentId)
Fetch all results for a specific student. Can filter by a specific `examId`.

```bash
curl -X GET "http://localhost:5000/api/results/student/STUDENT_ID_HERE?examId=EXAM_ID_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 5. Get Class Merit List / Results (GET /api/results/class)
Fetch results for all students in a specific class for a specific exam.

```bash
curl -X GET "http://localhost:5000/api/results/class?className=10&section=A&examId=EXAM_ID_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 6. Delete Result Record (DELETE /api/results/:id)
Remove a mistakenly entered result record.

```bash
curl -X DELETE http://localhost:5000/api/results/RESULT_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
