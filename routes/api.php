<?php

use App\Http\Controllers\API\FreelancerController;
use App\Http\Controllers\API\EmployerController;
use App\Http\Controllers\API\AvailabilityController;
use App\Http\Controllers\API\EducationController;
use App\Http\Controllers\API\PortfolioWorkController;
use App\Http\Controllers\API\SkillController;
use App\Http\Controllers\API\SavedBookmarkedController;
use App\Http\Controllers\API\AuthenticationController;
use App\Http\Controllers\API\ProjectListingController;
use App\Http\Controllers\API\NotificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Freeport API Routes
|--------------------------------------------------------------------------
|
| API endpoints with authentication and rate limiting
| Protected routes require Bearer token authentication
|
*/

// =============================================================================
// PUBLIC ROUTES (No Authentication Required)
// =============================================================================

// Authentication Endpoints (API #1)
Route::prefix('auth')->group(function () {
    // Public routes
    Route::post('register', [AuthenticationController::class, 'register']);
    Route::post('login', [AuthenticationController::class, 'login']);
    
    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthenticationController::class, 'logOut']);
        Route::get('user', [AuthenticationController::class, 'userInfo']);
        Route::get('users', [AuthenticationController::class, 'userList']);
    });
});

// Public Read-Only Access (for browsing freelancers/employers/projects)
Route::get('freelancers', [FreelancerController::class, 'index']);
Route::get('freelancers/{id}', [FreelancerController::class, 'show']);
Route::get('freelancers/{id}/portfolio', [FreelancerController::class, 'portfolio']);
Route::get('freelancers/{id}/skills', [FreelancerController::class, 'skills']);
Route::get('employers', [EmployerController::class, 'index']);
Route::get('employers/{id}', [EmployerController::class, 'show']);
Route::get('projects', [ProjectListingController::class, 'index']);
Route::get('projects/{id}', [ProjectListingController::class, 'show']);

// =============================================================================
// PROTECTED ROUTES (Authentication Required)
// =============================================================================

// Test route to verify token works
Route::middleware('auth:sanctum')->get('test-auth', function (Request $request) {
    return response()->json([
        'success' => true,
        'message' => 'Token is valid!',
        'user' => $request->user()
    ]);
});

Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    
    // Authentication Management
    Route::post('auth/logout', [AuthenticationController::class, 'logOut']);
    Route::get('auth/user', [AuthenticationController::class, 'userInfo']);

    // Freelancers API (API #2) - Full CRUD
    Route::post('freelancers', [FreelancerController::class, 'store']);
    Route::put('freelancers/{id}', [FreelancerController::class, 'update']);
    Route::delete('freelancers/{id}', [FreelancerController::class, 'destroy']);

    // Employers API (API #3) - Full CRUD
    Route::post('employers', [EmployerController::class, 'store']);
    Route::put('employers/{id}', [EmployerController::class, 'update']);
    Route::delete('employers/{id}', [EmployerController::class, 'destroy']);
    Route::get('employers/{id}/bookmarks', [EmployerController::class, 'bookmarks']);

    // Project Listings API (API #9)
    Route::post('projects', [ProjectListingController::class, 'store']);
    Route::put('projects/{id}', [ProjectListingController::class, 'update']);
    Route::delete('projects/{id}', [ProjectListingController::class, 'destroy']);
    Route::post('projects/{id}/interest', [ProjectListingController::class, 'registerInterest']);

    // Profile image upload endpoints
    Route::post('freelancers/{id}/profile-picture', [FreelancerController::class, 'uploadProfilePicture']);
    Route::post('employers/{id}/company-logo', [EmployerController::class, 'uploadCompanyLogo']);

    // Availability API (API #4) - Full CRUD
    Route::apiResource('availability', AvailabilityController::class);

    // Education API (API #5) - Full CRUD
    Route::apiResource('education', EducationController::class);

    // Portfolio Work API (API #6) - Full CRUD
    Route::apiResource('portfolio-work', PortfolioWorkController::class);

    // Skills API (API #7) - Full CRUD
    Route::apiResource('skills', SkillController::class);

    // Saved/Bookmarked API (API #8) - Full CRUD
    Route::apiResource('saved-bookmarked', SavedBookmarkedController::class);

    // Notifications API
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::post('notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead']);
});