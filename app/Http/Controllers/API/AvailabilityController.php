<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Availability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AvailabilityController extends Controller
{
    /**
     * Display a listing of all availability records.
     */
    public function index()
    {
        $availability = Availability::with('freelancer')->get();
        
        return response()->json([
            'success' => true,
            'message' => 'Availability records retrieved successfully',
            'data' => $availability
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Store a newly created availability record.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'FreelancerID' => 'required|exists:freelancers,FreelancerID',
            'CurrentProjectsCount' => 'integer|min:0',
            'ActivityStatus' => 'string',
            'NextAvailabilityDate' => 'nullable|date',
            'WeeklyHoursAvailable' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422, [], JSON_PRETTY_PRINT);
        }

        $availability = Availability::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Availability created successfully',
            'data' => $availability
        ], 201, [], JSON_PRETTY_PRINT);
    }

    /**
     * Display the specified availability record.
     */
    public function show(string $id)
    {
        $availability = Availability::with('freelancer')->find($id);

        if (!$availability) {
            return response()->json([
                'success' => false,
                'message' => 'Availability record not found'
            ], 404, [], JSON_PRETTY_PRINT);
        }

        return response()->json([
            'success' => true,
            'data' => $availability
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Update the specified availability record.
     */
    public function update(Request $request, string $id)
    {
        $availability = Availability::find($id);

        if (!$availability) {
            return response()->json([
                'success' => false,
                'message' => 'Availability record not found'
            ], 404, [], JSON_PRETTY_PRINT);
        }

        $validator = Validator::make($request->all(), [
            'CurrentProjectsCount' => 'sometimes|integer|min:0',
            'ActivityStatus' => 'sometimes|string',
            'NextAvailabilityDate' => 'nullable|date',
            'WeeklyHoursAvailable' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422, [], JSON_PRETTY_PRINT);
        }

        $availability->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Availability updated successfully',
            'data' => $availability
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Remove the specified availability record.
     */
    public function destroy(string $id)
    {
        $availability = Availability::find($id);

        if (!$availability) {
            return response()->json([
                'success' => false,
                'message' => 'Availability record not found'
            ], 404, [], JSON_PRETTY_PRINT);
        }

        $availability->delete();

        return response()->json([
            'success' => true,
            'message' => 'Availability deleted successfully'
        ], 200, [], JSON_PRETTY_PRINT);
    }
}
