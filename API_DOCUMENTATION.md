# SEMS / EPMS — API Reference Documentation

Base URL: `http://localhost:4000/api` (Development) or `https://api.yourdomain.com/api` (Production)

---

## 🔒 Authentication & Headers

- **Bearer Token**: All protected routes require `Authorization: Bearer <accessToken>` header or an `accessToken` HTTP-only cookie.
- **Role Enforcement**: Certain routes are restricted to specific roles (`SUPER_ADMIN`, `SCHOOL_ADMIN`, `TEACHER`, `PARENT`).

---

## 1. Auth Module (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/login` | Public | Authenticates user credentials & returns JWT access + refresh tokens. |
| `POST` | `/signup` | Public | Registers initial school admin user. |
| `POST` | `/refresh` | Public | Issues new `accessToken` using a valid `refreshToken`. |
| `POST` | `/logout` | Authenticated | Clears user cookies & invalidates session tokens. |
| `GET` | `/me` | Authenticated | Fetches profile of currently logged in user. |
| `PUT` | `/profile` | Authenticated | Updates first name, last name, phone, or password. |
| `GET` | `/users` | Admin | Lists all user accounts associated with the school. |
| `POST` | `/users` | Admin | Creates a new user account (e.g. Teacher, School Admin). |
| `PUT` | `/users/:id` | Admin | Updates user role, status, or assignment. |
| `DELETE` | `/users/:id` | Admin | Soft-deletes user account. |

---

## 2. Admissions Module (`/api/admissions`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Authenticated | Lists admissions with pagination, search, status, and program filters. |
| `GET` | `/:id` | Authenticated | Fetches full admission record including student, parent, program, invoices, and receipts. |
| `POST` | `/` | Admin | Creates student record, parent record, and active admission record in a single transaction. |
| `PUT` | `/:id` | Admin | Updates admission parameters or discount assignment. |
| `POST` | `/:id/graduate` | Admin | Transitions active student to `GRADUATED` status. |
| `POST` | `/:id/quit` | Admin | Transitions active student to `QUIT` status with exit reason. |
| `POST` | `/:id/transfer-out` | Admin | Initiates transfer out request for student. |

---

## 3. Enquiry Module (`/api/enquiries`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Authenticated | Lists enquiries filtered by stage (`NEW`, `CONTACTED`, `FOLLOW_UP`, `CONVERTED`, `LOST`). |
| `GET` | `/:id` | Authenticated | Fetches single enquiry details and follow-up timeline. |
| `POST` | `/` | Staff / Admin | Records new prospective student enquiry. |
| `PUT` | `/:id` | Staff / Admin | Updates enquiry information or stage. |
| `POST` | `/:id/follow-up` | Staff / Admin | Appends a follow-up interaction note & sets next contact date. |
| `POST` | `/:id/convert` | Admin | Converts converted enquiry into an active Admission record. |

---

## 4. Fees & Billing Module (`/api/fees`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/calculate` | Authenticated | Calculates term fee breakup & discount deductions. |
| `GET` | `/receipts/:admissionId` | Authenticated | Lists fee receipts issued for an admission. |
| `POST` | `/receipts` | Admin | Issues a new fee receipt and appends SOA ledger entry. |
| `GET` | `/cash-receipts` | Authenticated | Lists uncollected cash receipts for bank deposit conversion. |
| `POST` | `/deposits` | Admin | Records bank deposit slip for collected cash/cheques. |
| `POST` | `/convert-payment` | Admin | Converts cash receipt to online payment. |

---

## 5. Statement of Accounts (SOA) Module (`/api/soa`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/summary` | Authenticated | Retrieves SOA summary balance, total invoiced, total collected, and program counts. |
| `GET` | `/details` | Authenticated | Retrieves full SOA ledger transactions grouped by collection type. |

---

## 6. Academics Module (`/api/academics`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/subjects` | Authenticated | Lists subjects registered for a program. |
| `POST` | `/subjects` | Admin | Creates a new academic subject. |
| `GET` | `/exams` | Authenticated | Lists scheduled examinations for the academic year. |
| `POST` | `/exams` | Admin | Creates a new examination schedule. |
| `POST` | `/assessments` | Teacher / Admin | Defines assessment criteria for an exam subject. |
| `POST` | `/marks` | Teacher / Admin | Performs bulk marks entry for student assessments. |

---

## 7. Attendance Module (`/api/attendance`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/student` | Teacher / Admin | Marks attendance for an individual student. |
| `POST` | `/student/bulk` | Teacher / Admin | Performs bulk class attendance entry. |
| `GET` | `/student` | Authenticated | Retrieves student attendance history and percentage metrics. |
| `POST` | `/teacher` | Admin | Marks attendance for coaches/staff. |
| `GET` | `/teacher` | Authenticated | Retrieves staff attendance records. |

---

## 8. Students Module (`/api/students`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/:id` | Authenticated | Retrieves student master profile (strictly scoped by school). |
| `POST` | `/documents` | Teacher / Admin | Uploads student document (Birth Cert, Aadhar, Photo). |
| `GET` | `/:studentId/documents` | Authenticated | Lists documents uploaded for a student. |
| `PUT` | `/documents/:documentId/verify` | Admin | Updates verification status of student document. |

---

## 9. Graduation Module (`/api/graduation`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/list` | Authenticated | Lists student graduation records. |
| `POST` | `/:admissionId` | Admin | Graduates student to next program level & writes AuditLog. |

---

## 10. Transfers Module (`/api/transfers`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/requests` | Authenticated | Lists inter-school transfer requests. |
| `POST` | `/request` | Admin | Initiates transfer out request for a student. |
| `PUT` | `/:id/status` | Admin | Approves or completes transfer request. |

---

## 11. Quit Module (`/api/quit`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/list` | Authenticated | Lists student exit / quit records. |
| `POST` | `/:admissionId` | Admin | Records student withdrawal & writes AuditLog. |

---

## 12. Franchisee Operations (`/api/franchisee`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/invoices` | Authenticated | Retrieves franchisee SOA billing entries. |
| `GET` | `/royalty-forecast` | Authenticated | Calculates monthly forecasted royalty revenue. |
| `GET` | `/coaches` | Authenticated | Lists active school teachers and staff. |
