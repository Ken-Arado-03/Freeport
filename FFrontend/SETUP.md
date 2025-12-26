# FFrontend + Laravel Sanctum API Integration Guide

## Setup Instructions

### 1. Install FFrontend Dependencies
```bash
cd FFrontend
npm install
```

### 2. Start Both Servers

**Terminal 1 - Backend (Laravel API)**
```bash
cd laravel-sanctum-api
php artisan serve
# Server runs on http://localhost:8000
```

**Terminal 2 - Frontend (React)**
```bash
cd laravel-sanctum-api/FFrontend
npm run dev
# Frontend runs on http://localhost:3000
# API calls automatically proxy to http://localhost:8000/api
```

## API Configuration

The frontend is configured to:
- Make API requests to `http://localhost:8000/api`
- Automatically include Bearer token in Authorization header
- Store auth token in localStorage
- Handle 401 errors by redirecting to login

## Available API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user

### Freelancers
- `GET /api/freelancers` - List all freelancers
- `POST /api/freelancers` - Create freelancer profile
- `GET /api/freelancers/{id}` - Get freelancer details
- `PUT /api/freelancers/{id}` - Update freelancer
- `DELETE /api/freelancers/{id}` - Delete freelancer
- `GET /api/freelancers/{id}/skills` - Get skills
- `GET /api/freelancers/{id}/portfolio` - Get portfolio

### Employers
- `GET /api/employers` - List all employers
- `POST /api/employers` - Create employer profile
- `GET /api/employers/{id}` - Get employer details
- `PUT /api/employers/{id}` - Update employer
- `DELETE /api/employers/{id}` - Delete employer
- `GET /api/employers/{id}/bookmarks` - Get bookmarks

### Other Resources
- `GET /api/skills` - List skills
- `GET /api/education` - List education
- `GET /api/availability` - Check availability
- `GET /api/saved-bookmarked` - Get bookmarks

## Example API Usage in React

```typescript
import api from '@/lib/api';

// Login
const response = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'password'
});
localStorage.setItem('authToken', response.data.token);

// Get freelancers
const freelancers = await api.get('/freelancers');

// Create freelancer profile
const freelancer = await api.post('/freelancers', {
  name: 'John Doe',
  bio: 'Full Stack Developer',
  hourly_rate: 50
});
```

## Database Information

The backend is fully seeded with test data:
- Freelancers with skills, portfolios, education
- Employers with company info
- All with sample relationships

Use any of these credentials to test:
- Email: Any user email from database
- Password: Check your seeders

## Build for Production

```bash
npm run build
# Compiled files in FFrontend/build/
```

## Troubleshooting

- **CORS Issues**: Make sure both servers are running
- **API Not Found**: Check Laravel server is on port 8000
- **Token Issues**: Clear localStorage and re-login
- **Build Errors**: Delete node_modules and run `npm install` again
