# Detailed Schema: AI Data Requirements

## 1. AI Assistant & Conversation

### ai_conversations
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| school_id | UUID | FK -> schools(id) | |
| user_id | UUID | FK -> users(id) | |
| context_type | VARCHAR(50) | | "Parent Assistant", "Teacher Assistant", "Admin" |
| started_at | TIMESTAMP | DEFAULT NOW() | |
| metadata | JSONB | | Contextual hints (e.g. current page) |

### ai_messages
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | BIGINT | PRIMARY KEY | |
| conversation_id | UUID | FK -> ai_conversations(id) | |
| role | VARCHAR(20) | | "user", "assistant", "system" |
| content | TEXT | | |
| prompt_tokens | INT | | |
| completion_tokens | INT | | |
| feedback_rating | INT | | 1-5 scale |
| created_at | TIMESTAMP | DEFAULT NOW() | |

---

## 2. AI Insights & Predictions

### ai_insights
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| school_id | UUID | FK -> schools(id) | |
| target_type | VARCHAR(50) | | "Student", "Class", "School" |
| target_id | UUID | | ID of the student/class |
| category | VARCHAR(50) | | "Academic Risk", "Attendance Risk", "Fee Default" |
| insight_text | TEXT | | Human-readable insight |
| confidence_score | DECIMAL(3,2) | | 0.00 to 1.00 |
| data_points | JSONB | | Evidence for the insight |
| status | VARCHAR(20) | | "Active", "Dismissed", "Resolved" |
| created_at | TIMESTAMP | | |

---

## 3. AI Generated Content

### ai_generated_content
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| school_id | UUID | FK -> schools(id) | |
| creator_id | UUID | FK -> users(id) | |
| type | VARCHAR(50) | | "Lesson Plan", "Question Paper", "Report Comment" |
| input_params | JSONB | | Parameters used for generation |
| generated_output | TEXT | | Raw text or JSON |
| refined_output | TEXT | | User-edited version |
| version | INT | | |

---

## 4. AI Analytics & Patterns

### student_learning_patterns
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | BIGINT | PRIMARY KEY | |
| student_id | UUID | FK -> students(id) | |
| engagement_score | DECIMAL(5,2) | | Derived from attendance/submissions |
| subject_strengths | JSONB | | Vector or map of subject performance |
| predicted_gpa | DECIMAL(3,2) | | |
| updated_at | TIMESTAMP | | |

### ai_vector_store
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| id | UUID | PRIMARY KEY | |
| school_id | UUID | FK -> schools(id) | |
| content_type | VARCHAR(50) | | "Curriculum", "Policy", "Knowledge Base" |
| content_body | TEXT | | |
| embedding | VECTOR(1536) | | pgvector embeddings for RAG |
| metadata | JSONB | | Source file, page, etc. |
