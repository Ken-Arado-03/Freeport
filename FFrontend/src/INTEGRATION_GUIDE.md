# Laravel Integration Guide

This guide will help you integrate this React frontend with your Laravel backend.

## 📋 Prerequisites

- Laravel 10+ with Sanctum installed
- Node.js 18+
- Your Laravel API running on `http://localhost:8000` (or update `.env`)

## 🚀 Quick Start (5 Steps)

### Step 1: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env and set your Laravel API URL
VITE_API_BASE_URL=http://localhost:8000/api
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Laravel CORS

In your Laravel project, update `config/cors.php`:

```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    
    'allowed_methods' => ['*'],
    
    'allowed_origins' => [
        'http://localhost:5173',  // Vite dev server
        'http://localhost:3000',  // Alternative port
        'https://your-production-domain.com'
    ],
    
    'allowed_origins_patterns' => [],
    
    'allowed_headers' => ['*'],
    
    'exposed_headers' => [],
    
    'max_age' => 0,
    
    'supports_credentials' => true,
];
```

### Step 4: Configure Sanctum

In `config/sanctum.php`:

```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:3000,localhost:5173,127.0.0.1,127.0.0.1:8000,::1',
    env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : ''
))),
```

### Step 5: Run the Application

```bash
npm run dev
```

Visit `http://localhost:5173`

---

## 🔌 API Endpoints Reference

### Authentication Endpoints

Your Laravel backend should implement these routes:

```php
// routes/api.php

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/users', [AuthController::class, 'users']);
});
```

#### Expected Response Format

**Login Response:**
```json
{
  "success": true,
  "data": {
    "token": "1|abc123...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "user_type": "freelancer"
    }
  },
  "message": "Login successful"
}
```

**Error Response (422 Validation):**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

### Freelancer Endpoints

```php
Route::middleware('auth:sanctum')->group(function () {
    // Freelancer CRUD
    Route::get('/freelancers', [FreelancerController::class, 'index']);
    Route::post('/freelancers', [FreelancerController::class, 'store']);
    Route::get('/freelancers/{id}', [FreelancerController::class, 'show']);
    Route::put('/freelancers/{id}', [FreelancerController::class, 'update']);
    Route::delete('/freelancers/{id}', [FreelancerController::class, 'destroy']);
    
    // Related resources
    Route::get('/freelancers/{id}/skills', [FreelancerController::class, 'skills']);
    Route::get('/freelancers/{id}/portfolio', [FreelancerController::class, 'portfolio']);
    Route::get('/freelancers/{id}/reviews', [FreelancerController::class, 'reviews']);
});
```

### Skills Endpoints

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/skills', [SkillController::class, 'index']);
    Route::post('/skills', [SkillController::class, 'store']);
    Route::put('/skills/{id}', [SkillController::class, 'update']);
    Route::delete('/skills/{id}', [SkillController::class, 'destroy']);
});
```

**Expected Request Body (POST /api/skills):**
```json
{
  "SkillName": "React",
  "ProficiencyLevel": "Expert",
  "YearsOfExperience": 5
}
```

### Portfolio Endpoints

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/portfolio', [PortfolioController::class, 'index']);
    Route::post('/portfolio', [PortfolioController::class, 'store']);
    Route::put('/portfolio/{id}', [PortfolioController::class, 'update']);
    Route::delete('/portfolio/{id}', [PortfolioController::class, 'destroy']);
});
```

**Expected Request Body (POST /api/portfolio):**
```json
{
  "ProjectTitle": "E-commerce Platform",
  "Description": "Built a full-featured e-commerce platform...",
  "ProjectURL": "https://example.com/project",
  "ImageURL": "https://example.com/image.jpg"
}
```

### Education Endpoints

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/education', [EducationController::class, 'index']);
    Route::post('/education', [EducationController::class, 'store']);
    Route::put('/education/{id}', [EducationController::class, 'update']);
    Route::delete('/education/{id}', [EducationController::class, 'destroy']);
});
```

### Availability Endpoints

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/availability', [AvailabilityController::class, 'index']);
    Route::post('/availability', [AvailabilityController::class, 'store']);
});
```

### Employer Endpoints

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/employers', [EmployerController::class, 'index']);
    Route::post('/employers', [EmployerController::class, 'store']);
    Route::get('/employers/{id}', [EmployerController::class, 'show']);
    Route::put('/employers/{id}', [EmployerController::class, 'update']);
    Route::delete('/employers/{id}', [EmployerController::class, 'destroy']);
    Route::get('/employers/{id}/bookmarks', [EmployerController::class, 'bookmarks']);
});
```

### Bookmarks Endpoints (Two-way)

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/saved-bookmarked', [BookmarkController::class, 'index']);
    Route::post('/saved-bookmarked', [BookmarkController::class, 'store']);
    Route::delete('/saved-bookmarked/{id}', [BookmarkController::class, 'destroy']);
});
```

**Expected Request Body (POST /api/saved-bookmarked):**
```json
{
  "freelancer_id": 123,  // For employers bookmarking freelancers
  "employer_id": 456     // For freelancers bookmarking employers
}
```

### Messages Endpoints

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/messages/threads', [MessageController::class, 'threads']);
    Route::get('/messages/threads/{userId}', [MessageController::class, 'thread']);
    Route::post('/messages', [MessageController::class, 'send']);
    Route::put('/messages/{id}/read', [MessageController::class, 'markAsRead']);
});
```

**Expected Response for Threads (GET /api/messages/threads):**
```json
{
  "data": [
    {
      "user_id": 2,
      "user_name": "John Doe",
      "user_avatar": "https://...",
      "user_type": "freelancer",
      "last_message": "Thanks for reaching out!",
      "last_message_time": "2025-11-23T10:30:00Z",
      "unread_count": 2
    }
  ]
}
```

### Projects Endpoints (Employers)

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::get('/projects/{id}', [ProjectController::class, 'show']);
    Route::put('/projects/{id}', [ProjectController::class, 'update']);
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);
});
```

**Expected Request Body (POST /api/projects):**
```json
{
  "title": "Full-Stack Developer Needed",
  "description": "We are looking for...",
  "budget": 5000,
  "duration": "3 months",
  "skills_required": ["React", "Node.js", "PostgreSQL"],
  "status": "open"
}
```

### Reviews Endpoints

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/freelancers/{id}/reviews', [ReviewController::class, 'index']);
    Route::post('/reviews', [ReviewController::class, 'store']);
});
```

---

## 🔐 Authentication Implementation

### Laravel Controller Example

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'user_type' => $user->user_type, // 'freelancer' or 'employer'
                ]
            ],
            'message' => 'Login successful'
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function user(Request $request)
    {
        return response()->json([
            'data' => $request->user()
        ]);
    }
}
```

---

## 🎨 Frontend API Usage Examples

### Using the API Service

The frontend includes a centralized API service at `/services/api.ts`. Here's how it's used:

```typescript
import api from '../services/api';

// Authentication
const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.auth.login(email, password);
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('userType', response.data.user.user_type);
    localStorage.setItem('userId', response.data.user.id);
    return response;
  } catch (error) {
    // Error is automatically shown via toast
    console.error(error);
  }
};

// Fetching data
const loadFreelancers = async () => {
  try {
    const response = await api.freelancers.getAll({
      search: 'React',
      min_rate: 50,
      max_rate: 150
    });
    setFreelancers(response.data);
  } catch (error) {
    // Error handling is automatic
  }
};

// Creating data
const addSkill = async (skillData) => {
  try {
    await api.skills.create(skillData);
    toast.success('Skill added successfully');
    loadSkills(); // Refresh list
  } catch (error) {
    // Validation errors are shown automatically
  }
};
```

---

## 🔍 Testing the Integration

### 1. Test Authentication

```bash
# Login test
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### 2. Test Protected Route

```bash
# Get current user (requires token)
curl -X GET http://localhost:8000/api/auth/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

### 3. Test CRUD Operations

```bash
# Create a skill
curl -X POST http://localhost:8000/api/skills \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "SkillName": "React",
    "ProficiencyLevel": "Expert",
    "YearsOfExperience": 5
  }'
```

---

## 🐛 Troubleshooting

### Issue: CORS Errors

**Error:** `Access to fetch at 'http://localhost:8000/api/...' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Solution:**
1. Check `config/cors.php` includes your frontend URL
2. Clear Laravel config cache: `php artisan config:clear`
3. Restart Laravel server

### Issue: 401 Unauthorized on Protected Routes

**Error:** `401 Unauthorized`

**Solution:**
1. Ensure token is being sent in headers
2. Check token hasn't expired
3. Verify Sanctum is properly configured
4. Check `config/sanctum.php` stateful domains

### Issue: Validation Errors Not Showing

**Error:** Validation errors not displayed in forms

**Solution:**
1. Ensure Laravel returns errors in this format:
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "field_name": ["Error message"]
  }
}
```
2. Check HTTP status code is 422

### Issue: Session Expired Immediately

**Error:** User logged out immediately after login

**Solution:**
1. Check `supports_credentials` is `true` in CORS config
2. Ensure cookies are being sent with requests
3. Verify `SANCTUM_STATEFUL_DOMAINS` includes your frontend domain

---

## 📦 Production Deployment

### Frontend Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables (Production)

```env
VITE_API_BASE_URL=https://api.yourproductiondomain.com/api
```

### Laravel Production Checklist

- [ ] Update CORS allowed origins to include production domain
- [ ] Configure SANCTUM_STATEFUL_DOMAINS for production
- [ ] Enable HTTPS for both frontend and backend
- [ ] Set up proper session/cookie domain configuration
- [ ] Configure rate limiting for API endpoints
- [ ] Set up Laravel Horizon for queue jobs (if using)
- [ ] Enable Laravel caching (route, config, view)

---

## 🎯 Next Steps

1. **Implement File Uploads**: Add support for profile pictures and portfolio images
2. **Real-time Features**: Implement WebSockets for messaging and notifications
3. **Search Optimization**: Add full-text search with Laravel Scout
4. **Pagination**: Implement cursor or offset pagination
5. **Rate Limiting**: Configure API rate limits
6. **Testing**: Add API tests with Pest or PHPUnit

---

## 📚 Additional Resources

- [Laravel Sanctum Documentation](https://laravel.com/docs/sanctum)
- [Laravel API Resources](https://laravel.com/docs/eloquent-resources)
- [React Query](https://tanstack.com/query/latest) - Consider for advanced data fetching
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

## 💬 Support

If you encounter issues:
1. Check Laravel logs: `storage/logs/laravel.log`
2. Check browser console for frontend errors
3. Verify API responses with browser DevTools Network tab
4. Test API endpoints with Postman or curl

Good luck with your integration! 🚀
