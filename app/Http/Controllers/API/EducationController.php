<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Education;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EducationController extends Controller
{
    /**
     * Display a listing of all education records.
     */
    public function index()
    {
        $education = Education::with('freelancer')->get();
        
        return response()->json([
            'success' => true,
            'message' => 'Education records retrieved successfully',
            'data' => $education
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Store a newly created education record.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'FreelancerID' => 'required|exists:freelancers,FreelancerID',
            'Degree' => 'required|string',
            'Major' => 'required|string',
            'InstitutionName' => 'required|string',
            'GraduationYear' => 'required|integer',
            'GPA' => 'nullable|numeric|min:0|max:4',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422, [], JSON_PRETTY_PRINT);
        }

        $education = Education::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Education created successfully',
            'data' => $education
        ], 201, [], JSON_PRETTY_PRINT);
    }

    /**
     * Display the specified education record.
     */
    public function show(string $id)
    {
        $education = Education::with('freelancer')->find($id);

        if (!$education) {
            return response()->json([
                'success' => false,
                'message' => 'Education record not found'
            ], 404, [], JSON_PRETTY_PRINT);
        }

        return response()->json([
            'success' => true,
            'data' => $education
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Update the specified education record.
     */
    public function update(Request $request, string $id)
    {
        $education = Education::find($id);

        if (!$education) {
            return response()->json([
                'success' => false,
                'message' => 'Education record not found'
            ], 404, [], JSON_PRETTY_PRINT);
        }

        $validator = Validator::make($request->all(), [
            'Degree' => 'sometimes|string',
            'Major' => 'sometimes|string',
            'InstitutionName' => 'sometimes|string',
            'GraduationYear' => 'sometimes|integer',
            'GPA' => 'nullable|numeric|min:0|max:4',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422, [], JSON_PRETTY_PRINT);
        }

        $education->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Education updated successfully',
            'data' => $education
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Remove the specified education record.
     */
    public function destroy(string $id)
    {
        $education = Education::find($id);

        if (!$education) {
            return response()->json([
                'success' => false,
                'message' => 'Education record not found'
            ], 404, [], JSON_PRETTY_PRINT);
        }

        $education->delete();

        return response()->json([
            'success' => true,
            'message' => 'Education deleted successfully'
        ], 200, [], JSON_PRETTY_PRINT);
    }
}
