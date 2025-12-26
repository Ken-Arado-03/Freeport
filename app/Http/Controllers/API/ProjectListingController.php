<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Employer;
use App\Models\Freelancer;
use App\Models\ProjectInterest;
use App\Models\ProjectListing;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ProjectListingController extends Controller
{
    public function index(Request $request)
    {
        $query = ProjectListing::with('employer');

        if ($employerId = $request->query('employer_id')) {
            $query->where('EmployerID', $employerId);
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $projects = $query->orderByDesc('created_at')->get();

        return response()->json([
            'success' => true,
            'message' => 'Project listings retrieved successfully',
            'data' => $projects,
            'count' => $projects->count(),
        ], 200, [], JSON_PRETTY_PRINT);
    }

    public function show(string $id)
    {
        $project = ProjectListing::with('employer')->find($id);

        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found',
            ], 404, [], JSON_PRETTY_PRINT);
        }

        return response()->json([
            'success' => true,
            'message' => 'Project retrieved successfully',
            'data' => $project,
        ], 200, [], JSON_PRETTY_PRINT);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user || $user->user_type !== 'employer') {
            return response()->json([
                'success' => false,
                'message' => 'Only employer accounts can create projects',
            ], 403, [], JSON_PRETTY_PRINT);
        }

        $employer = Employer::where('Email', $user->email)->first();

        if (!$employer) {
            return response()->json([
                'success' => false,
                'message' => 'Employer profile not found for this user',
            ], 422, [], JSON_PRETTY_PRINT);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'budget' => 'nullable|numeric|min:0',
            'duration' => 'nullable|string|max:255',
            'job_type' => 'nullable|string|max:100',
            'experience_needed' => 'nullable|string|max:255',
            'skills_required' => 'nullable|array',
            'skills_required.*' => 'string|max:100',
            'status' => 'nullable|in:open,in_progress,completed,closed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422, [], JSON_PRETTY_PRINT);
        }

        $data = $validator->validated();
        $data['EmployerID'] = $employer->EmployerID;

        if (isset($data['skills_required']) && is_array($data['skills_required'])) {
            $data['skills_required'] = array_values($data['skills_required']);
        }

        if (!isset($data['status'])) {
            $data['status'] = 'open';
        }

        $project = ProjectListing::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully',
            'data' => $project,
        ], 201, [], JSON_PRETTY_PRINT);
    }

    public function update(Request $request, string $id)
    {
        $user = Auth::user();

        if (!$user || $user->user_type !== 'employer') {
            return response()->json([
                'success' => false,
                'message' => 'Only employer accounts can update projects',
            ], 403, [], JSON_PRETTY_PRINT);
        }

        $employer = Employer::where('Email', $user->email)->first();

        if (!$employer) {
            return response()->json([
                'success' => false,
                'message' => 'Employer profile not found for this user',
            ], 422, [], JSON_PRETTY_PRINT);
        }

        $project = ProjectListing::find($id);

        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found',
            ], 404, [], JSON_PRETTY_PRINT);
        }

        if ((int) $project->EmployerID !== (int) $employer->EmployerID) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have permission to modify this project',
            ], 403, [], JSON_PRETTY_PRINT);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'budget' => 'nullable|numeric|min:0',
            'duration' => 'nullable|string|max:255',
            'job_type' => 'nullable|string|max:100',
            'experience_needed' => 'nullable|string|max:255',
            'skills_required' => 'nullable|array',
            'skills_required.*' => 'string|max:100',
            'status' => 'nullable|in:open,in_progress,completed,closed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422, [], JSON_PRETTY_PRINT);
        }

        $data = $validator->validated();

        if (isset($data['skills_required']) && is_array($data['skills_required'])) {
            $data['skills_required'] = array_values($data['skills_required']);
        }

        $project->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully',
            'data' => $project,
        ], 200, [], JSON_PRETTY_PRINT);
    }

    public function destroy(string $id)
    {
        $user = Auth::user();

        if (!$user || $user->user_type !== 'employer') {
            return response()->json([
                'success' => false,
                'message' => 'Only employer accounts can delete projects',
            ], 403, [], JSON_PRETTY_PRINT);
        }

        $employer = Employer::where('Email', $user->email)->first();

        if (!$employer) {
            return response()->json([
                'success' => false,
                'message' => 'Employer profile not found for this user',
            ], 422, [], JSON_PRETTY_PRINT);
        }

        $project = ProjectListing::find($id);

        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found',
            ], 404, [], JSON_PRETTY_PRINT);
        }

        if ((int) $project->EmployerID !== (int) $employer->EmployerID) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have permission to delete this project',
            ], 403, [], JSON_PRETTY_PRINT);
        }

        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully',
        ], 200, [], JSON_PRETTY_PRINT);
    }

    public function registerInterest(Request $request, string $id)
    {
        $user = Auth::user();

        if (!$user || $user->user_type !== 'freelancer') {
            return response()->json([
                'success' => false,
                'message' => 'Only freelancer accounts can register interest',
            ], 403, [], JSON_PRETTY_PRINT);
        }

        $freelancer = Freelancer::where('Email', $user->email)->first();

        if (!$freelancer) {
            return response()->json([
                'success' => false,
                'message' => 'Freelancer profile not found for this user',
            ], 422, [], JSON_PRETTY_PRINT);
        }

        $project = ProjectListing::find($id);

        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found',
            ], 404, [], JSON_PRETTY_PRINT);
        }

        $interest = ProjectInterest::firstOrCreate([
            'project_listing_id' => $project->id,
            'FreelancerID' => $freelancer->FreelancerID,
        ]);

        if ($interest->wasRecentlyCreated) {
            $project->increment('interest_count');
            $project->refresh();

            // Create notification for the employer's user account
            $employer = Employer::find($project->EmployerID);
            if ($employer) {
                $employerUser = User::where('email', $employer->Email)->first();

                if ($employerUser) {
                    $freelancerName = trim($freelancer->FirstName . ' ' . $freelancer->LastName);
                    $message = sprintf(
                        '%s is interested in your project "%s".',
                        $freelancerName ?: 'A freelancer',
                        $project->title
                    );

                    Notification::create([
                        'user_id' => $employerUser->id,
                        'title' => 'Someone was interested in your project list',
                        'message' => $message,
                        'data' => [
                            'freelancer_id' => $freelancer->FreelancerID,
                            'freelancer_name' => $freelancerName,
                            'freelancer_avatar' => $freelancer->ProfilePicture,
                            'project_id' => $project->id,
                            'project_title' => $project->title,
                            'url' => '/freelancers/' . $freelancer->FreelancerID,
                        ],
                    ]);
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Interest registered successfully',
            'data' => [
                'project_id' => $project->id,
                'interest_count' => $project->interest_count,
            ],
        ], 200, [], JSON_PRETTY_PRINT);
    }
}
