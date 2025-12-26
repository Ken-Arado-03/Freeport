<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
            ], 401, [], JSON_PRETTY_PRINT);
        }

        $notifications = Notification::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Notifications retrieved successfully',
            'data' => $notifications,
            'count' => $notifications->count(),
        ], 200, [], JSON_PRETTY_PRINT);
    }

    public function markAsRead(string $id)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
            ], 401, [], JSON_PRETTY_PRINT);
        }

        $notification = Notification::where('user_id', $user->id)->find($id);

        if (!$notification) {
            return response()->json([
                'success' => false,
                'message' => 'Notification not found',
            ], 404, [], JSON_PRETTY_PRINT);
        }

        if (!$notification->read_at) {
            $notification->read_at = now();
            $notification->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Notification marked as read',
            'data' => $notification,
        ], 200, [], JSON_PRETTY_PRINT);
    }

    public function markAllAsRead(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated',
            ], 401, [], JSON_PRETTY_PRINT);
        }

        Notification::where('user_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read',
        ], 200, [], JSON_PRETTY_PRINT);
    }
}
