<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SkillController extends Controller
{
    /**
     * Display a listing of all skills.
     */
    public function index()
    {
        $skills = Skill::with('freelancer')->get();
        
        return response()->json([
            'success' => true,
            'message' => 'Skills retrieved successfully',
            'data' => $skills
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Store a newly created skill.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'FreelancerID' => 'required|exists:freelancers,FreelancerID',
            'SkillName' => 'required|string',
            'ProficiencyLevel' => 'nullable|string',
            'YearsOfExperience' => 'nullable|integer|min:0',
            'Certification' => 'nullable|in:Yes,No',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422, [], JSON_PRETTY_PRINT);
        }

        $skill = Skill::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Skill created successfully',
            'data' => $skill
        ], 201, [], JSON_PRETTY_PRINT);
    }

    /**
     * Display the specified skill.
     */
    public function show(string $id)
    {
        $skill = Skill::with('freelancer')->find($id);

        if (!$skill) {
            return response()->json([
                'success' => false,
                'message' => 'Skill not found'
            ], 404, [], JSON_PRETTY_PRINT);
        }

        return response()->json([
            'success' => true,
            'data' => $skill
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Update the specified skill.
     */
    public function update(Request $request, string $id)
    {
        $skill = Skill::find($id);

        if (!$skill) {
            return response()->json([
                'success' => false,
                'message' => 'Skill not found'
            ], 404, [], JSON_PRETTY_PRINT);
        }

        $validator = Validator::make($request->all(), [
            'SkillName' => 'sometimes|string',
            'ProficiencyLevel' => 'nullable|string',
            'YearsOfExperience' => 'nullable|integer|min:0',
            'Certification' => 'nullable|in:Yes,No',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422, [], JSON_PRETTY_PRINT);
        }

        $skill->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Skill updated successfully',
            'data' => $skill
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Remove the specified skill.
     */
    public function destroy(string $id)
    {
        $skill = Skill::find($id);

        if (!$skill) {
            return response()->json([
                'success' => false,
                'message' => 'Skill not found'
            ], 404, [], JSON_PRETTY_PRINT);
        }

        $skill->delete();

        return response()->json([
            'success' => true,
            'message' => 'Skill deleted successfully'
        ], 200, [], JSON_PRETTY_PRINT);
    }
}
