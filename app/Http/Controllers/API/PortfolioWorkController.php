<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\PortfolioWork;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PortfolioWorkController extends Controller
{
    /**
     * Display a listing of all portfolio work.
     */
    public function index()
    {
        $portfolioWork = PortfolioWork::with('freelancer')->get();
        
        return response()->json([
            'success' => true,
            'message' => 'Portfolio work retrieved successfully',
            'data' => $portfolioWork
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Store a newly created portfolio work.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'FreelancerID' => 'required|exists:freelancers,FreelancerID',
            'ProjectTitle' => 'required|string',
            'ProjectDescription' => 'nullable|string',
            'TechnologiesUsed' => 'nullable|string',
            'CompletionDate' => 'nullable|date',
            'ProjectURL' => 'nullable|string',
            'ProjectFile' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422, [], JSON_PRETTY_PRINT);
        }

        $portfolioWork = PortfolioWork::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Portfolio work created successfully',
            'data' => $portfolioWork
        ], 201, [], JSON_PRETTY_PRINT);
    }

    /**
     * Display the specified portfolio work.
     */
    public function show(string $id)
    {
        $portfolioWork = PortfolioWork::with('freelancer')->find($id);

        if (!$portfolioWork) {
            return response()->json([
                'success' => false,
                'message' => 'Portfolio work not found'
            ], 404, [], JSON_PRETTY_PRINT);
        }

        return response()->json([
            'success' => true,
            'data' => $portfolioWork
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Update the specified portfolio work.
     */
    public function update(Request $request, string $id)
    {
        $portfolioWork = PortfolioWork::find($id);

        if (!$portfolioWork) {
            return response()->json([
                'success' => false,
                'message' => 'Portfolio work not found'
            ], 404, [], JSON_PRETTY_PRINT);
        }

        $validator = Validator::make($request->all(), [
            'ProjectTitle' => 'sometimes|string',
            'ProjectDescription' => 'nullable|string',
            'TechnologiesUsed' => 'nullable|string',
            'CompletionDate' => 'nullable|date',
            'ProjectURL' => 'nullable|string',
            'ProjectFile' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422, [], JSON_PRETTY_PRINT);
        }

        $portfolioWork->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Portfolio work updated successfully',
            'data' => $portfolioWork
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Remove the specified portfolio work.
     */
    public function destroy(string $id)
    {
        $portfolioWork = PortfolioWork::find($id);

        if (!$portfolioWork) {
            return response()->json([
                'success' => false,
                'message' => 'Portfolio work not found'
            ], 404, [], JSON_PRETTY_PRINT);
        }

        $portfolioWork->delete();

        return response()->json([
            'success' => true,
            'message' => 'Portfolio work deleted successfully'
        ], 200, [], JSON_PRETTY_PRINT);
    }
}
