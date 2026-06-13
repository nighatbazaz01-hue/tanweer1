# Detailed Schema: Admissions, Students & Parents

## 1. Admission Management Module

### admission_leads
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| school_id | UUID | FK -> schools(id) | |
| student_first_name | VARCHAR(100) | | |
| student_last_name | VARCHAR(100) | | |
| parent_name | VARCHAR(255) | | |
| parent_email | VARCHAR(255) | | |
| parent_phone | VARCHAR(50) | | |
| interest_class_id | UUID | FK -> classes(id) | |
| source | VARCHAR(50) | | e.g. "Website", "Referral" |
| status | VARCHAR(20) | | e.g. "New", "Contacted" |

### admission_applications
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| school_id | UUID | FK -> schools(id) | |
| academic_year_id | UUID | FK -> academic_years(id) | |
| application_number | VARCHAR(50) | UNIQUE | e.g. "APP-2024-001" |
| lead_id | UUID | FK -> admission_leads(id) | |
| student_data | JSONB | | Full student details for review |
| parent_data | JSONB | | Full parent details for review |
| status | VARCHAR(50) | | "Draft", "Submitted", "Under Review", "Approved", "Rejected" |
| submitted_at | TIMESTAMP | | |

### application_documents
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| application_id | UUID | FK -> admission_applications(id) | |
| document_type | VARCHAR(50) | | e.g. "Birth Certificate" |
| file_url | TEXT | | S3 URL |
| status | VARCHAR(20) | | "Pending", "Verified", "Invalid" |

### application_schedules
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| application_id | UUID | FK -> admission_applications(id) | |
| activity_type | VARCHAR(50) | | "Interaction", "Assessment" |
| scheduled_at | TIMESTAMP | | |
| location | VARCHAR(255) | | |
| notes | TEXT | | |

---

## 2. Student Management Module

### students
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| school_id | UUID | FK -> schools(id) | |
| user_id | UUID | FK -> users(id) | Login credentials |
| admission_number | VARCHAR(50) | UNIQUE | |
| roll_number | VARCHAR(50) | | |
| enrollment_date | DATE | | |
| academic_history | JSONB | | Previous school details |
| medical_info | JSONB | | Allergies, blood group, etc. |
| house_id | UUID | | If school uses house system |

### student_enrollments
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| student_id | UUID | FK -> students(id) | |
| academic_year_id | UUID | FK -> academic_years(id) | |
| section_id | UUID | FK -> sections(id) | |
| status | VARCHAR(20) | | "Active", "Withdrawn", "Graduated" |

---

## 3. Parent Management Module

### parents
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| user_id | UUID | FK -> users(id) | Login credentials |
| occupation | VARCHAR(255) | | |
| income_range | VARCHAR(50) | | |
| communication_prefs | JSONB | | SMS, Email, Push |

### student_parent_mappings
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| student_id | UUID | FK -> students(id) | |
| parent_id | UUID | FK -> parents(id) | |
| relationship | VARCHAR(50) | | "Father", "Mother", "Guardian" |
| is_emergency_contact | BOOLEAN | | |
| has_custody | BOOLEAN | | |
