# Detailed Schema: Operations & Finance

## 1. Fee Management Module

### fee_categories
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| school_id | UUID | FK -> schools(id) | |
| name | VARCHAR(100) | | e.g. "Tuition Fee", "Transport" |
| description | TEXT | | |

### fee_structures
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| school_id | UUID | FK -> schools(id) | |
| academic_year_id | UUID | FK -> academic_years(id) | |
| class_id | UUID | FK -> classes(id), NULLABLE | |
| fee_category_id | UUID | FK -> fee_categories(id) | |
| amount | DECIMAL(12,2) | | |
| frequency | VARCHAR(20) | | "Monthly", "Quarterly", "Annual" |

### student_fee_discounts
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| student_id | UUID | FK -> students(id) | |
| fee_category_id | UUID | FK -> fee_categories(id) | |
| discount_type | VARCHAR(20) | | "Percentage", "Fixed" |
| value | DECIMAL(12,2) | | |
| reason | VARCHAR(255) | | e.g. "Scholarship" |

### fee_payments
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| school_id | UUID | FK -> schools(id) | |
| student_id | UUID | FK -> students(id) | |
| amount_paid | DECIMAL(12,2) | | |
| payment_date | TIMESTAMP | | |
| payment_method | VARCHAR(50) | | "Online", "Cash", "Cheque" |
| transaction_id | VARCHAR(100) | | External gateway ID |
| receipt_number | VARCHAR(50) | UNIQUE | |
| status | VARCHAR(20) | | "Completed", "Pending", "Failed" |

---

## 2. Communication Management Module

### communications
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | BIGINT | PRIMARY KEY | |
| school_id | UUID | FK -> schools(id) | |
| sender_id | UUID | FK -> users(id) | |
| type | VARCHAR(20) | | "SMS", "Email", "Push", "Circular" |
| recipient_type | VARCHAR(20) | | "Class", "Section", "All", "Individual" |
| subject | VARCHAR(255) | | |
| content | TEXT | | |
| sent_at | TIMESTAMP | DEFAULT NOW() | |

---

## 3. Library Management Module

### books
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| school_id | UUID | FK -> schools(id) | |
| title | VARCHAR(255) | | |
| isbn | VARCHAR(20) | | |
| author | VARCHAR(255) | | |
| category | VARCHAR(100) | | |
| total_copies | INT | | |
| available_copies | INT | | |

### book_loans
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| book_id | UUID | FK -> books(id) | |
| user_id | UUID | FK -> users(id) | Borrower |
| borrowed_at | TIMESTAMP | | |
| due_date | DATE | | |
| returned_at | TIMESTAMP | | |
| fine_amount | DECIMAL(8,2) | | |

---

## 4. Transport & Inventory

### transport_routes
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| school_id | UUID | FK -> schools(id) | |
| route_name | VARCHAR(100) | | |
| vehicle_details | VARCHAR(255) | | |
| driver_name | VARCHAR(255) | | |
| driver_phone | VARCHAR(50) | | |

### inventory_items
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| school_id | UUID | FK -> schools(id) | |
| name | VARCHAR(255) | | |
| sku | VARCHAR(50) | | |
| quantity | INT | | |
| unit | VARCHAR(20) | | e.g. "Pieces", "Boxes" |
| vendor_info | JSONB | | |

---

## 5. Document Management

### documents
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| school_id | UUID | FK -> schools(id) | |
| owner_id | UUID | FK -> users(id) | |
| category | VARCHAR(50) | | "Student", "Staff", "Admin" |
| title | VARCHAR(255) | | |
| file_url | TEXT | | S3 URL |
| tags | TEXT[] | | |
| created_at | TIMESTAMP | | |
