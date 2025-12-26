<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Employer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class EmployerController extends Controller
{
    /**
     * Display a listing of all employers.
     */
    public function index(Request $request)
    {
        $query = Employer::with('savedFreelancers');

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('CompanyName', 'LIKE', "%{$search}%")
                    ->orWhere('ContactPersonName', 'LIKE', "%{$search}%")
                    ->orWhere('Email', 'LIKE', "%{$search}%")
                    ->orWhere('Address', 'LIKE', "%{$search}%");
            });
        }

        if ($industry = $request->query('industry')) {
            $query->where('IndustryType', 'LIKE', "%{$industry}%");
        }

        if ($location = $request->query('location')) {
            $query->where('Address', 'LIKE', "%{$location}%");
        }

        // Order by most recently updated so the latest profile version is kept
        $employers = $query->orderBy('updated_at', 'desc')->get();

        // Ensure we don't return duplicate companies for the same company name
        $uniqueEmployers = $employers->unique('CompanyName')->values();
        
        return response()->json([
            'success' => true,
            'message' => 'Employers retrieved successfully',
            'data' => $uniqueEmployers,
            'count' => $uniqueEmployers->count()
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Store a newly created employer in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'CompanyName' => 'required|string|max:255',
            'ContactPersonName' => 'required|string|max:255',
            'Email' => 'required|email|unique:employers,Email',
            'PhoneNumber' => 'nullable|string',
            'CompanyLogo' => 'nullable|string',
            'CompanyWebsite' => 'nullable|string',
            'Address' => 'nullable|string',
            'IndustryType' => 'nullable|string',
            'CompanyDescription' => 'nullable|string',
            'CompanySize' => 'nullable|string|max:255',
            'Founded' => 'nullable|string|max:255',
            'TalentHeadline' => 'nullable|string|max:255',
            'TalentAreas' => 'nullable|string',
            'TalentWhyUs' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422, [], JSON_PRETTY_PRINT);
        }

        $employer = Employer::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Employer created successfully',
            'data' => $employer
        ], 201, [], JSON_PRETTY_PRINT);
    }

    /**
     * Display the specified employer.
     */
    public function show(string $id)
    {
        $employer = Employer::with('savedFreelancers')->find($id);

        if (!$employer) {
            return response()->json([
                'success' => false,
                'message' => 'Employer not found'
            ], 404, [], JSON_PRETTY_PRINT);
        }

        return response()->json([
            'success' => true,
            'message' => 'Employer retrieved successfully',
            'data' => $employer
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Update the specified employer in storage.
     */
    public function update(Request $request, string $id)
    {
        $employer = Employer::find($id);

        if (!$employer) {
            return response()->json([
                'success' => false,
                'message' => 'Employer not found'
            ], 404, [], JSON_PRETTY_PRINT);
        }

        $validator = Validator::make($request->all(), [
            'CompanyName' => 'sometimes|string|max:255',
            'ContactPersonName' => 'sometimes|string|max:255',
            'Email' => 'sometimes|email|unique:employers,Email,' . $id . ',EmployerID',
            'PhoneNumber' => 'nullable|string',
            'CompanyLogo' => 'nullable|string',
            'CompanyWebsite' => 'nullable|string',
            'Address' => 'nullable|string',
            'IndustryType' => 'nullable|string',
            'CompanyDescription' => 'nullable|string',
            'CompanySize' => 'nullable|string|max:255',
            'Founded' => 'nullable|string|max:255',
            'TalentHeadline' => 'nullable|string|max:255',
            'TalentAreas' => 'nullable|string',
            'TalentWhyUs' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422, [], JSON_PRETTY_PRINT);
        }

        $employer->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Employer updated successfully',
            'data' => $employer
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Remove the specified employer from storage.
     */
    public function destroy(string $id)
    {
        $employer = Employer::find($id);

        if (!$employer) {
            return response()->json([
                'success' => false,
                'message' => 'Employer not found'
            ], 404, [], JSON_PRETTY_PRINT);
        }

        $employer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Employer deleted successfully'
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Get bookmarked freelancers for a specific employer.
     */
    public function bookmarks(string $id)
    {
        $employer = Employer::find($id);

        if (!$employer) {
            return response()->json([
                'success' => false,
                'message' => 'Employer not found'
            ], 404, [], JSON_PRETTY_PRINT);
        }

        $bookmarks = $employer->savedFreelancers()->with('freelancer')->get();

        return response()->json([
            'success' => true,
            'message' => 'Bookmarked freelancers retrieved successfully',
            'data' => $bookmarks,
            'count' => $bookmarks->count()
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Upload and update the employer's company logo.
     */
    public function uploadCompanyLogo(Request $request, string $id)
    {
        $employer = Employer::find($id);

        if (!$employer) {
            return response()->json([
                'success' => false,
                'message' => 'Employer not found',
            ], 404, [], JSON_PRETTY_PRINT);
        }

        $request->validate([
            'image' => 'required|image|max:5120',
        ]);

        $path = $request->file('image')->store('company-logos', 'public');
        $url = Storage::url($path);

        $employer->CompanyLogo = $url;
        $employer->save();

        return response()->json([
            'success' => true,
            'message' => 'Company logo updated successfully',
            'data' => $employer,
        ], 200, [], JSON_PRETTY_PRINT);
    }
}
