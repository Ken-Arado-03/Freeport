<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Models\Freelancer;
use App\Models\Employer;

class AuthenticationController extends Controller
{
    /**
     * Register a new account.
     */
    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name'      => 'required|string|min:4',
                'email'     => 'required|string|email|max:255|unique:users',
                'password'  => 'required|string|min:8',
                'user_type' => 'nullable|in:freelancer,employer',
            ]);

            $userType = $validated['user_type'] ?? 'freelancer';

            $user = User::create([
                'name'      => $validated['name'],
                'email'     => $validated['email'],
                'password'  => Hash::make($validated['password']),
                'user_type' => $userType,
            ]);

            // Also create a basic profile record in the role-specific table
            // so that new accounts immediately exist in freelancers/employers.
            if ($userType === 'freelancer') {
                if (!Freelancer::where('Email', $user->email)->exists()) {
                    $fullName = $user->name ?? '';
                    $parts = preg_split('/\s+/', trim($fullName), 2);
                    $firstName = $parts[0] ?? $fullName;
                    $lastName = $parts[1] ?? '';

                    Freelancer::create([
                        'FirstName'          => $firstName,
                        'LastName'           => $lastName,
                        'Email'              => $user->email,
                        'AccountCreatedDate' => now(),
                    ]);
                }
            } else {
                if (!Employer::where('Email', $user->email)->exists()) {
                    Employer::create([
                        'CompanyName'       => $user->name,
                        'ContactPersonName' => $user->name,
                        'Email'             => $user->email,
                    ]);
                }
            }

            return response()->json([
                'response_code' => 201,
                'status'        => 'success',
                'message'       => 'Successfully registered',
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'response_code' => 422,
                'status'        => 'error',
                'message'       => 'Validation failed',
                'errors'        => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Registration Error: ' . $e->getMessage());

            return response()->json([
                'response_code' => 500,
                'status'        => 'error',
                'message'       => 'Registration failed',
            ], 500);
        }
    }

    /**
     * Login and return auth token.
     */
    public function login(Request $request)
    {
        try {
            $credentials = $request->validate([
                'email'    => 'required|email',
                'password' => 'required|string',
            ]);

            if (!Auth::guard('web')->attempt($credentials)) {
                return response()->json([
                    'response_code' => 401,
                    'status'        => 'error',
                    'message'       => 'Invalid email or password',
                ], 401);
            }

            $user = Auth::guard('web')->user();
            $token = $user->createToken('authToken')->plainTextToken;

            return response()->json([
                'response_code' => 200,
                'status'        => 'success',
                'message'       => 'Login successful',
                'user_info'     => [
                    'id'        => $user->id,
                    'name'      => $user->name,
                    'email'     => $user->email,
                    'user_type' => $user->user_type,
                ],
                'token'       => $token,
                'token_type'  => 'Bearer',
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'response_code' => 422,
                'status'        => 'error',
                'message'       => 'Validation failed',
                'errors'        => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Login Error: ' . $e->getMessage());
            return response()->json([
                'response_code' => 500,
                'status'        => 'error',
                'message'       => 'Login failed',
            ], 500);
        }
    }

        /**
         * Get list of users (paginated) — protected route.
         */
        public function userInfo()
        {
            try {
                $user = Auth::user();

                if ($user && $user->email) {
                    $avatar = null;

                    if ($user->user_type === 'freelancer') {
                        $freelancer = Freelancer::where('Email', $user->email)->first();
                        if ($freelancer) {
                            $avatar = $freelancer->ProfilePicture ?? null;
                        }
                    } elseif ($user->user_type === 'employer') {
                        $employer = Employer::where('Email', $user->email)->first();
                        if ($employer) {
                            $avatar = $employer->CompanyLogo ?? null;
                        }
                    }

                    if ($avatar) {
                        $user->setAttribute('avatar', $avatar);
                        $user->setAttribute('profile_picture', $avatar);
                    }
                }

                return response()->json([
                    'response_code' => 200,
                    'status'        => 'success',
                    'message'       => 'User information retrieved successfully',
                    'user'          => $user
                ]);
            } catch (\Exception $e) {
                Log::error('User Info Error: ' . $e->getMessage());
                return response()->json([
                    'response_code' => 500,
                    'status'        => 'error',
                    'message'       => 'Failed to fetch user information',
                ], 500);
            }
        }

        /**
         * Get list of all users (paginated)
         */
        public function userList()
        {
            try {
                $users = User::latest()->paginate(10);

                return response()->json([
                    'response_code'  => 200,
                    'status'        => 'success',
                    'message'       => 'Fetched user list successfully',
                    'data'          => $users,
                ]);
            } catch (\Exception $e) {
                Log::error('User List Error: ' . $e->getMessage());

                return response()->json([
                    'response_code' => 500,
                    'status'        => 'error',
                    'message'       => 'Failed to fetch user list',
                ], 500);
            }
        }

        /**
         * Logout user and revoke tokens — protected route.
         */
        public function logOut(Request $request)
        {
            try {
                $user = $request->user();

                if ($user) {
                    $user->tokens()->delete();

                    return response()->json([
                        'response_code' => 200,
                        'status'        => 'success',
                        'message'       => 'Successfully logged out',
                    ]);
                }

                return response()->json([
                    'response_code' => 401,
                    'status'        => 'error',
                    'message'       => 'User not authenticated',
                ], 401);
            } catch (\Exception $e) {
                Log::error('Logout Error: ' . $e->getMessage());

                return response()->json([
                    'response_code' => 500,
                    'status'        => 'error',
                    'message'       => 'An error occurred during logout',
                ], 500);
            }
        }
    }
