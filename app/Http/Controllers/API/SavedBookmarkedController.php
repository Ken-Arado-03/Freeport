<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\SavedBookmarked;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SavedBookmarkedController extends Controller
{
    /**
     * Display a listing of all saved/bookmarked freelancers.
     */
    public function index()
    {
        $savedBookmarked = SavedBookmarked::with(['freelancer', 'employer'])->get();
        
        return response()->json([
            'success' => true,
            'message' => 'Saved bookmarked records retrieved successfully',
            'data' => $savedBookmarked
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Store a newly created saved/bookmarked record.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'FreelancerID' => 'required|exists:freelancers,FreelancerID',
            'EmployerID' => 'required|exists:employers,EmployerID',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422, [], JSON_PRETTY_PRINT);
        }

        $savedBookmarked = SavedBookmarked::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Freelancer bookmarked successfully',
            'data' => $savedBookmarked
        ], 201, [], JSON_PRETTY_PRINT);
    }

    /**
     * Display the specified saved/bookmarked record.
     */
    public function show(string $id)
    {
        $savedBookmarked = SavedBookmarked::with(['freelancer', 'employer'])->find($id);

        if (!$savedBookmarked) {
            return response()->json([
                'success' => false,
                'message' => 'Saved bookmarked record not found'
            ], 404, [], JSON_PRETTY_PRINT);
        }

        return response()->json([
            'success' => true,
            'data' => $savedBookmarked
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Update the specified saved/bookmarked record.
     */
    public function update(Request $request, string $id)
    {
        $savedBookmarked = SavedBookmarked::find($id);

        if (!$savedBookmarked) {
            return response()->json([
                'success' => false,
                'message' => 'Saved bookmarked record not found'
            ], 404, [], JSON_PRETTY_PRINT);
        }

        $savedBookmarked->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Saved bookmarked record updated successfully',
            'data' => $savedBookmarked
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Remove the specified saved/bookmarked record.
     */
    public function destroy(string $id)
    {
        $savedBookmarked = SavedBookmarked::find($id);

        if (!$savedBookmarked) {
            return response()->json([
                'success' => false,
                'message' => 'Saved bookmarked record not found'
            ], 404, [], JSON_PRETTY_PRINT);
        }

        $savedBookmarked->delete();

        return response()->json([
            'success' => true,
            'message' => 'Bookmark removed successfully'
        ], 200, [], JSON_PRETTY_PRINT);
    }
}
