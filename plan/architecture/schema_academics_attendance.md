# Detailed Schema: Academics, Staff & Attendance

## 1. Staff Management Module

### staff
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| school_id | UUID | FK -> schools(id) | |
| user_id | UUID | FK -> users(id) | |
| employee_id | VARCHAR(50) | UNIQUE | |
| department | VARCHAR(100) | | e.g. "Academics", "Admin" |
| designation | VARCHAR(100) | | e.g. "Senior Teacher" |
| joining_date | DATE | | |
| qualifications | JSONB | | Degrees, Certifications |
| experience | JSONB | | Previous employment |
| salary_details | JSONB | | Basic, HRA, etc. (Encrypted) |
| status | VARCHAR(20) | | "Active", "On Leave", "Resigned" |

### leave_applications
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| staff_id | UUID | FK -> staff(id) | |
| leave_type | VARCHAR(50) | | "Sick", "Casual", "Earned" |
| start_date | DATE | | |
| end_date | DATE | | |
| reason | TEXT | | |
| status | VARCHAR(20) | | "Pending", "Approved", "Rejected" |

---

## 2. Attendance Management Module

### attendance_records
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | BIGINT | PRIMARY KEY | |
| school_id | UUID | FK -> schools(id) | |
| user_id | UUID | FK -> users(id) | Student or Staff |
| date | DATE | | |
| status | VARCHAR(20) | | "Present", "Absent", "Late", "Half-day" |
| check_in | TIMESTAMP | | |
| check_out | TIMESTAMP | | |
| subject_id | UUID | FK -> subjects(id), NULLABLE | For subject-wise attendance |
| remarks | TEXT | | |

---

## 3. Examination & Grading Module

### exam_plans
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| school_id | UUID | FK -> schools(id) | |
| academic_year_id | UUID | FK -> academic_years(id) | |
| name | VARCHAR(100) | | e.g. "Final Term 2024" |
| start_date | DATE | | |
| end_date | DATE | | |

### exam_subjects
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| exam_plan_id | UUID | FK -> exam_plans(id) | |
| subject_id | UUID | FK -> subjects(id) | |
| class_id | UUID | FK -> classes(id) | |
| date | DATE | | |
| max_marks | DECIMAL(5,2) | | |
| passing_marks | DECIMAL(5,2) | | |

### exam_results
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | BIGINT | PRIMARY KEY | |
| exam_subject_id | UUID | FK -> exam_subjects(id) | |
| student_id | UUID | FK -> students(id) | |
| marks_obtained | DECIMAL(5,2) | | |
| grade_id | UUID | FK -> grade_scales(id) | |
| teacher_remarks | TEXT | | |

### grade_scales
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| school_id | UUID | FK -> schools(id) | |
| name | VARCHAR(10) | | "A+", "B", etc. |
| min_percentage | DECIMAL(5,2) | | |
| max_percentage | DECIMAL(5,2) | | |
| gpa_value | DECIMAL(3,2) | | |

---

## 4. Assignments & Timetable

### assignments
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| school_id | UUID | FK -> schools(id) | |
| teacher_id | UUID | FK -> staff(id) | |
| section_id | UUID | FK -> sections(id) | |
| subject_id | UUID | FK -> subjects(id) | |
| title | VARCHAR(255) | | |
| description | TEXT | | |
| attachment_urls | JSONB | | S3 URLs |
| due_date | TIMESTAMP | | |
| total_points | INT | | |

### assignment_submissions
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| assignment_id | UUID | FK -> assignments(id) | |
| student_id | UUID | FK -> students(id) | |
| submission_text | TEXT | | |
| attachment_urls | JSONB | | |
| submitted_at | TIMESTAMP | | |
| marks_awarded | DECIMAL(5,2) | | |
| feedback | TEXT | | |

### timetable_entries
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| section_id | UUID | FK -> sections(id) | |
| subject_id | UUID | FK -> subjects(id) | |
| teacher_id | UUID | FK -> staff(id) | |
| room_id | UUID | FK -> rooms(id) | |
| day_of_week | INT | | 1 (Mon) to 7 (Sun) |
| start_time | TIME | | |
| end_time | TIME | | |
