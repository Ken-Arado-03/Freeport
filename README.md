# Freeport Database API - Secure REST API System

A comprehensive, secure Laravel-based REST API system for managing freelancers, employers, and their relationships. This project implements **10 fully functional APIs** with complete CRUD operations, authentication, authorization, and comprehensive security measures.

## 🎯 Project Requirements Met

✅ **10 Functioning Secure APIs** with full CRUD operations  
✅ **Laravel Sanctum Authentication** for secure token-based API access  
✅ **Input Validation & Sanitization** to prevent XSS attacks  
✅ **SQL Injection Protection** via Laravel's Eloquent ORM  
✅ **CSRF Protection** implemented  
✅ **Rate Limiting** (60 requests/minute) for API security  
✅ **Authorization & Access Control** with middleware  
✅ **Proper HTTP Status Codes** (200, 201, 401, 404, 422, 500)  
✅ **JSON-formatted Responses** with pretty print  
✅ **MVC Architecture** with proper routes, controllers, models, migrations  
✅ **Comprehensive API Documentation** with request/response examples  
✅ **Database Relationships** properly configured  
✅ **Security Best Practices** implemented

## 📋 10 API Resources Overview

This system provides **10 fully functional, secure APIs** with complete CRUD operations:

### 1. **Authentication API** 🔐
   - User registration with password hashing
   - Token-based login (Laravel Sanctum)
   - Secure logout with token revocation
   - User information retrieval

### 2. **Freelancers API** 👤
   - Create, read, update, delete freelancers
   - Input validation and XSS protection
   - Regex validation for names

### 3. **Employers API** 🏢
   - Full CRUD for company profiles
   - Unique email validation
   - Relationship with bookmarked freelancers

### 4. **Availability API** 📅
   - Track freelancer availability status
   - Project capacity management
   - Weekly hours tracking

### 5. **Education API** 🎓
   - Educational background management
   - GPA validation (0-4 scale)
   - Institution and degree tracking

### 6. **Skills API** 💻
   - Skill proficiency levels
   - Years of experience tracking
   - Certification status

### 7. **Portfolio Work API** 📁
   - Project showcase
   - Technology stack documentation
   - Completion date tracking

### 8. **Saved/Bookmarked API** ⭐
   - Employer-freelancer bookmarking
   - Date tracking for saved items
   - Relationship management

### 9. **Custom Freelancer Portfolio Endpoint** 🔍
   - Retrieve all portfolio items for a specific freelancer
   - Optimized query with relationships

### 10. **Custom Freelancer Skills Endpoint** 🎯
   - Retrieve all skills for a specific freelancer
   - Filtered skill data retrieval

## Database Structure

The database follows the ERD provided with the following tables:
- `freelancers`
- `employers`
- `availability`
- `education`
- `skills`
- `portfolio_work`
- `saved_bookmarked`

## Installation & Setup

### Prerequisites
- PHP 8.1 or higher
- Composer
- MySQL or MariaDB
- Postman (for API testing)

### Step 1: Configure Database

Update your `.env` file with your MySQL credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=Freeport
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
```

### Step 2: Create Database

Create the database in MySQL:

```sql
CREATE DATABASE Freeport;
```

### Step 3: Run Migrations

This will create all necessary tables and drop old Laravel default tables:

```bash
php artisan migrate:fresh
```

### Step 4: Seed Database

Populate the database with sample data:

```bash
php artisan db:seed
```

### Step 5: Start Server

```bash
php artisan serve
```

The API will be available at: `http://localhost:8000`

## 📡 API Endpoints Documentation

All responses are in JSON format with **pretty print** enabled.

### 🔐 Authentication Endpoints (API #1)

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

Body:
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
}

Response (201):
{
    "response_code": 201,
    "status": "success",
    "message": "Successfully registered"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

Body:
{
    "email": "john@example.com",
    "password": "password123"
}

Response (200):
{
    "response_code": 200,
    "status": "success",
    "message": "Login successful",
    "user_info": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
    },
    "token": "1|aBcDeFgHiJkLmNoPqRsTuVwXyZ...",
    "token_type": "Bearer"
}
```

#### Logout (Protected)
```http
POST /api/auth/logout
Authorization: Bearer YOUR_TOKEN_HERE

Response (200):
{
    "response_code": 200,
    "status": "success",
    "message": "Successfully logged out"
}
```

---

### 👤 Freelancers API (API #2)

#### Public Endpoints
- `GET /api/freelancers` - Get all freelancers (No auth required)
- `GET /api/freelancers/{id}` - Get specific freelancer (No auth required)
- `GET /api/freelancers/{id}/portfolio` - Get freelancer's portfolio
- `GET /api/freelancers/{id}/skills` - Get freelancer's skills

#### Protected Endpoints (Require Authentication)
- `POST /api/freelancers` - Create new freelancer
- `PUT /api/freelancers/{id}` - Update freelancer
- `DELETE /api/freelancers/{id}` - Delete freelancer

#### Example: Create Freelancer (Protected)
```http
POST /api/freelancers
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

Body:
{
    "FirstName": "Jane",
    "LastName": "Smith",
    "Email": "jane.smith@example.com",
    "PhoneNumber": "+1234567890",
    "Bio": "Full-stack developer with 5 years experience",
    "Location": "San Francisco, USA"
}

Response (201):
{
    "success": true,
    "message": "Freelancer created successfully",
    "data": {
        "FreelancerID": 21,
        "FirstName": "Jane",
        "LastName": "Smith",
        ...
    }
}
```

---

### 🏢 Employers API (API #3)
- `GET /api/employers` - Get all employers
- `GET /api/employers/{id}` - Get specific employer
- `POST /api/employers` - Create employer (Protected)
- `PUT /api/employers/{id}` - Update employer (Protected)
- `DELETE /api/employers/{id}` - Delete employer (Protected)
- `GET /api/employers/{id}/bookmarks` - Get employer's bookmarks (Protected)

---

### 📅 Availability API (API #4) - Protected
- `GET /api/availability` - Get all records
- `GET /api/availability/{id}` - Get specific record
- `POST /api/availability` - Create record
- `PUT /api/availability/{id}` - Update record
- `DELETE /api/availability/{id}` - Delete record

---

### 🎓 Education API (API #5) - Protected
- `GET /api/education` - Get all education records
- `GET /api/education/{id}` - Get specific record
- `POST /api/education` - Create record
- `PUT /api/education/{id}` - Update record
- `DELETE /api/education/{id}` - Delete record

#### Example: Create Education
```http
POST /api/education
Authorization: Bearer YOUR_TOKEN_HERE

Body:
{
    "FreelancerID": 1,
    "Degree": "Bachelor of Science",
    "Major": "Computer Science",
    "InstitutionName": "MIT",
    "GraduationYear": 2020,
    "GPA": 3.85
}
```

---

### 💻 Skills API (API #6) - Protected
- `GET /api/skills` - Get all skills
- `GET /api/skills/{id}` - Get specific skill
- `POST /api/skills` - Create skill
- `PUT /api/skills/{id}` - Update skill
- `DELETE /api/skills/{id}` - Delete skill

---

### 📁 Portfolio Work API (API #7) - Protected
- `GET /api/portfolio-work` - Get all portfolio items
- `GET /api/portfolio-work/{id}` - Get specific item
- `POST /api/portfolio-work` - Create item
- `PUT /api/portfolio-work/{id}` - Update item
- `DELETE /api/portfolio-work/{id}` - Delete item

---

### ⭐ Saved/Bookmarked API (API #8) - Protected
- `GET /api/saved-bookmarked` - Get all bookmarks
- `GET /api/saved-bookmarked/{id}` - Get specific bookmark
- `POST /api/saved-bookmarked` - Create bookmark
- `PUT /api/saved-bookmarked/{id}` - Update bookmark
- `DELETE /api/saved-bookmarked/{id}` - Delete bookmark

## 🧪 Testing with Postman

### Step 1: Register a User
```http
POST http://localhost:8000/api/auth/register

Headers:
  Content-Type: application/json
  Accept: application/json

Body:
{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
}
```

### Step 2: Login to Get Token
```http
POST http://localhost:8000/api/auth/login

Headers:
  Content-Type: application/json
  Accept: application/json

Body:
{
    "email": "test@example.com",
    "password": "password123"
}

Response:
{
    "token": "1|aBcDeFg..." // COPY THIS TOKEN
}
```

### Step 3: Test Public Endpoints (No Token Needed)
```http
GET http://localhost:8000/api/freelancers

Headers:
  Accept: application/json
```

### Step 4: Test Protected Endpoints (Token Required)
```http
POST http://localhost:8000/api/freelancers

Headers:
  Content-Type: application/json
  Accept: application/json
  Authorization: Bearer YOUR_TOKEN_FROM_STEP_2

Body:
{
    "FirstName": "John",
    "LastName": "Doe",
    "Email": "john.unique@example.com",
    "PhoneNumber": "+1234567890",
    "Bio": "Full-stack developer",
    "Location": "New York, USA"
}
```

### Common HTTP Status Codes

| Code | Meaning | When It Occurs |
|------|---------|----------------|
| 200 | Success | GET, PUT, DELETE successful |
| 201 | Created | POST successful |
| 401 | Unauthorized | Missing or invalid token |
| 404 | Not Found | Resource doesn't exist |
| 422 | Validation Error | Invalid input data |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |

### Testing Rate Limiting
Make more than 60 requests within 1 minute to see rate limiting in action:
```
HTTP/1.1 429 Too Many Requests
{
    "message": "Too Many Attempts."
}
```

### Testing Validation Errors
Try to create a freelancer without required fields:
```http
POST http://localhost:8000/api/freelancers
Authorization: Bearer YOUR_TOKEN

Body:
{
    "FirstName": "John"
    // Missing required fields
}

Response (422):
{
    "success": false,
    "message": "Validation error",
    "errors": {
        "LastName": ["The LastName field is required."],
        "Email": ["The Email field is required."]
    }
}
```

## 🔒 Security Implementation

### 1. **Authentication & Authorization**
```php
// Laravel Sanctum Token-Based Authentication
Route::middleware(['auth:sanctum'])->group(function () {
    // Protected routes here
});
```

### 2. **Input Validation**
- **Regex Validation**: Names limited to alphabetic characters
- **Email Validation**: Built-in email format checking
- **Length Limits**: Max length constraints on all fields
- **Type Validation**: String, numeric, date validations

### 3. **XSS Protection**
```php
// Input sanitization example
$sanitizedData = [
    'FirstName' => strip_tags($request->FirstName),
    'Bio' => htmlspecialchars($request->Bio, ENT_QUOTES, 'UTF-8'),
    'Email' => filter_var($request->Email, FILTER_SANITIZE_EMAIL),
];
```

### 4. **SQL Injection Prevention**
- **Eloquent ORM**: All database queries use parameterized statements
- **Never raw queries**: No direct SQL injection vulnerabilities
- **Prepared statements**: Automatic parameter binding

### 5. **CSRF Protection**
- Enabled by default for all routes
- Token validation on state-changing requests
- Sanctum middleware configuration

### 6. **Rate Limiting**
```php
// 60 requests per minute per user
Route::middleware(['throttle:60,1'])->group(function () {
    // Rate-limited routes
});
```

### 7. **Password Security**
- **Bcrypt Hashing**: Automatic password hashing
- **Minimum 8 characters**: Enforced in validation
- **No password storage**: Only hashed versions saved

### 8. **CORS Configuration**
- Proper cross-origin resource sharing setup
- Controlled access from frontend applications
- Security headers implementation

### 9. **Error Handling**
- Proper HTTP status codes
- No sensitive information in error messages
- Structured error responses

### 10. **Database Security**
- Foreign key constraints
- Cascade deletions configured
- Data integrity enforcement

## Features

✅ **Complete CRUD Operations** for all 10 APIs  
✅ **Laravel Sanctum Authentication** with Bearer tokens  
✅ **Input Validation & Sanitization** (XSS protection)  
✅ **SQL Injection Prevention** via Eloquent ORM  
✅ **CSRF Protection** enabled  
✅ **Rate Limiting** (60 requests/minute)  
✅ **Password Hashing** with Bcrypt  
✅ **JSON Pretty Print** for all responses  
✅ **Eloquent Relationships** properly configured  
✅ **Database Seeders** with 20 random freelancers, 10 employers  
✅ **RESTful API** design following best practices  
✅ **Comprehensive Documentation** with examples  

## Database Relationships

- Freelancer **has one** Availability
- Freelancer **has many** Education records
- Freelancer **has many** Skills
- Freelancer **has many** Portfolio Work items
- Employer **has many** Saved/Bookmarked freelancers
- SavedBookmarked **belongs to** Freelancer and Employer

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // ... response data
  }
}
```

## License

This project is built with Laravel framework which is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
