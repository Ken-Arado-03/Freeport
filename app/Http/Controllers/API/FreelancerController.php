<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Freelancer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class FreelancerController extends Controller
{
    /**
     * Display a listing of all freelancers with their relationships.
     */
    public function index(Request $request)
    {
        $query = Freelancer::with(['availability', 'education', 'portfolioWork', 'skills']);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('FirstName', 'LIKE', "%{$search}%")
                    ->orWhere('LastName', 'LIKE', "%{$search}%")
                    ->orWhere('Email', 'LIKE', "%{$search}%")
                    ->orWhere('Bio', 'LIKE', "%{$search}%")
                    ->orWhereHas('skills', function ($skillQuery) use ($search) {
                        $skillQuery->where('SkillName', 'LIKE', "%{$search}%");
                    });
            });
        }

        if ($location = $request->query('location')) {
            $query->where('Location', 'LIKE', "%{$location}%");
        }

        if ($sortBy = $request->query('sort_by')) {
            if ($sortBy === 'newest') {
                $query->orderByDesc('AccountCreatedDate');
            }
        }

        $freelancers = $query->get();
        
        return response()->json([
            'success' => true,
            'message' => 'Freelancers retrieved successfully',
            'data' => $freelancers,
            'count' => $freelancers->count()
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Store a newly created freelancer in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'FirstName' => 'required|string|max:255|regex:/^[a-zA-Z\s]+$/',
            'LastName' => 'required|string|max:255|regex:/^[a-zA-Z\s]+$/',
            'Email' => 'required|email|unique:freelancers,Email|max:255',
            'PhoneNumber' => 'nullable|string|max:20',
            'ProfilePicture' => 'nullable|string|max:500',
            'Bio' => 'nullable|string|max:2000',
            'Location' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422, [], JSON_PRETTY_PRINT);
        }

        // Sanitize input to prevent XSS attacks
        $sanitizedData = [
            'FirstName' => strip_tags($request->FirstName),
            'LastName' => strip_tags($request->LastName),
            'Email' => filter_var($request->Email, FILTER_SANITIZE_EMAIL),
            'PhoneNumber' => $request->PhoneNumber ? strip_tags($request->PhoneNumber) : null,
            'ProfilePicture' => $request->ProfilePicture ? strip_tags($request->ProfilePicture) : null,
            'Bio' => $request->Bio ? htmlspecialchars($request->Bio, ENT_QUOTES, 'UTF-8') : null,
            'Location' => $request->Location ? strip_tags($request->Location) : null,
            'AccountCreatedDate' => now(),
        ];

        $freelancer = Freelancer::create($sanitizedData);

        return response()->json([
            'success' => true,
            'message' => 'Freelancer created successfully',
            'data' => $freelancer
        ], 201, [], JSON_PRETTY_PRINT);
    }

    /**
     * Display the specified freelancer with all relationships.
     */
    public function show(string $id)
    {
        $freelancer = Freelancer::with(['availability', 'education', 'portfolioWork', 'skills'])
            ->find($id);

        if (!$freelancer) {
            return response()->json([
                'success' => false,
                'message' => 'Freelancer not found'
            ], 404, [], JSON_PRETTY_PRINT);
        }

        return response()->json([
            'success' => true,
            'message' => 'Freelancer retrieved successfully',
            'data' => $freelancer
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Update the specified freelancer in storage.
     */
    public function update(Request $request, string $id)
    {
        $freelancer = Freelancer::find($id);

        if (!$freelancer) {
            return response()->json([
                'success' => false,
                'message' => 'Freelancer not found'
            ], 404, [], JSON_PRETTY_PRINT);
        }

        $validator = Validator::make($request->all(), [
            'FirstName' => 'sometimes|string|max:255',
            'LastName' => 'sometimes|string|max:255',
            'Email' => 'sometimes|email|unique:freelancers,Email,' . $id . ',FreelancerID',
            'PhoneNumber' => 'nullable|string',
            'ProfilePicture' => 'nullable|string',
            'Bio' => 'nullable|string',
            'Location' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422, [], JSON_PRETTY_PRINT);
        }

        $freelancer->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Freelancer updated successfully',
            'data' => $freelancer
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Remove the specified freelancer from storage.
     */
    public function destroy(string $id)
    {
        $freelancer = Freelancer::find($id);

        if (!$freelancer) {
            return response()->json([
                'success' => false,
                'message' => 'Freelancer not found'
            ], 404, [], JSON_PRETTY_PRINT);
        }

        $freelancer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Freelancer deleted successfully'
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Get portfolio work for a specific freelancer.
     */
    public function portfolio(string $id)
    {
        $freelancer = Freelancer::find($id);

        if (!$freelancer) {
            return response()->json([
                'success' => false,
                'message' => 'Freelancer not found'
            ], 404, [], JSON_PRETTY_PRINT);
        }

        $portfolio = $freelancer->portfolioWork;

        return response()->json([
            'success' => true,
            'message' => 'Portfolio retrieved successfully',
            'data' => $portfolio,
            'count' => $portfolio->count()
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Get skills for a specific freelancer.
     */
    public function skills(string $id)
    {
        $freelancer = Freelancer::find($id);

        if (!$freelancer) {
            return response()->json([
                'success' => false,
                'message' => 'Freelancer not found'
            ], 404, [], JSON_PRETTY_PRINT);
        }

        $skills = $freelancer->skills;

        return response()->json([
            'success' => true,
            'message' => 'Skills retrieved successfully',
            'data' => $skills,
            'count' => $skills->count()
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Upload and update the freelancer's profile picture.
     */
    public function uploadProfilePicture(Request $request, string $id)
    {
        $freelancer = Freelancer::find($id);

        if (!$freelancer) {
            return response()->json([
                'success' => false,
                'message' => 'Freelancer not found',
            ], 404, [], JSON_PRETTY_PRINT);
        }

        $request->validate([
            'image' => 'required|image|max:5120',
        ]);

        $path = $request->file('image')->store('profile-pictures', 'public');
        $url = Storage::url($path);

        $freelancer->ProfilePicture = $url;
        $freelancer->save();

        return response()->json([
            'success' => true,
            'message' => 'Profile picture updated successfully',
            'data' => $freelancer,
        ], 200, [], JSON_PRETTY_PRINT);
    }
}
