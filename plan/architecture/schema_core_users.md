# Detailed Schema: Core Organization & User Management

## 1. Organization Module

### schools
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique School ID |
| name | VARCHAR(255) | NOT NULL | School Name |
| slug | VARCHAR(100) | UNIQUE, NOT NULL | URL-friendly name |
| registration_number | VARCHAR(100) | | Legal registration |
| address | TEXT | | Principal address |
| contact_email | VARCHAR(255) | | Primary contact email |
| contact_phone | VARCHAR(50) | | Primary contact phone |
| logo_url | TEXT | | S3 URL to logo |
| settings | JSONB | | School-specific configurations |
| created_at | TIMESTAMP | DEFAULT NOW() | |
| updated_at | TIMESTAMP | DEFAULT NOW() | |

### academic_years
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| school_id | UUID | FK -> schools(id), NOT NULL | |
| name | VARCHAR(50) | NOT NULL | e.g. "2024-2025" |
| start_date | DATE | NOT NULL | |
| end_date | DATE | NOT NULL | |
| is_current | BOOLEAN | DEFAULT FALSE | |

### campuses
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| school_id | UUID | FK -> schools(id), NOT NULL | |
| name | VARCHAR(255) | NOT NULL | |
| address | TEXT | | |

### buildings
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| campus_id | UUID | FK -> campuses(id), NOT NULL | |
| name | VARCHAR(100) | NOT NULL | |

### rooms
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| building_id | UUID | FK -> buildings(id), NOT NULL | |
| name | VARCHAR(50) | NOT NULL | Room number/name |
| capacity | INT | | |

### classes
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| school_id | UUID | FK -> schools(id), NOT NULL | |
| name | VARCHAR(100) | NOT NULL | e.g. "Grade 10" |
| level_index | INT | | To sort classes (1, 2, 3...) |

### sections
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| class_id | UUID | FK -> classes(id), NOT NULL | |
| name | VARCHAR(50) | NOT NULL | e.g. "A", "B", "Blue" |
| room_id | UUID | FK -> rooms(id) | Default room for this section |

### subjects
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| school_id | UUID | FK -> schools(id), NOT NULL | |
| name | VARCHAR(100) | NOT NULL | |
| code | VARCHAR(20) | | e.g. "MATH101" |

### houses
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| school_id | UUID | FK -> schools(id), NOT NULL | |
| name | VARCHAR(100) | NOT NULL | e.g. "Red House", "Einstein" |
| color_code | VARCHAR(7) | | Hex code for UI |

---

## 2. User Management Module

### users
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| email | VARCHAR(255) | UNIQUE, NOT NULL | |
| password_hash | TEXT | NOT NULL | |
| phone_number | VARCHAR(50) | | |
| is_active | BOOLEAN | DEFAULT TRUE | |
| mfa_enabled | BOOLEAN | DEFAULT FALSE | |
| mfa_secret | TEXT | | |
| last_login_at | TIMESTAMP | | |
| created_at | TIMESTAMP | DEFAULT NOW() | |

### roles
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| name | VARCHAR(50) | NOT NULL | e.g. "Teacher", "Student" |
| description | TEXT | | |

### permissions
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| slug | VARCHAR(100) | UNIQUE, NOT NULL | e.g. "student.create" |
| description | TEXT | | |

### role_permissions
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| role_id | UUID | FK -> roles(id) | |
| permission_id | UUID | FK -> permissions(id) | |

### user_roles
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| user_id | UUID | FK -> users(id) | |
| role_id | UUID | FK -> roles(id) | |
| school_id | UUID | FK -> schools(id) | Scope of the role |

### user_profiles
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| user_id | UUID | PRIMARY KEY, FK -> users(id) | |
| first_name | VARCHAR(100) | NOT NULL | |
| last_name | VARCHAR(100) | NOT NULL | |
| date_of_birth | DATE | | |
| gender | VARCHAR(20) | | |
| profile_picture_url | TEXT | | |
| metadata | JSONB | | Extra flexible fields |

### login_history
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | BIGINT | PRIMARY KEY | |
| user_id | UUID | FK -> users(id) | |
| ip_address | INET | | |
| user_agent | TEXT | | |
| device_id | VARCHAR(255) | | |
| logged_in_at | TIMESTAMP | DEFAULT NOW() | |

### devices
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| user_id | UUID | FK -> users(id) | |
| device_token | TEXT | | For push notifications |
| platform | VARCHAR(20) | | e.g. "iOS", "Android" |
| last_seen_at | TIMESTAMP | | |
