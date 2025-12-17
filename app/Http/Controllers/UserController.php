<?php

// app/Http/Controllers/UserController.php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Get all users (Admin only)
     */
    public function index(Request $request)
    {
        $userRole = $request->header('X-User-Role') ?? $request->get('auth_user_role');
        // if ($userRole !== 'admin') {
        //     return response()->json([
        //         'error' => 'Forbidden',
        //         'message' => 'Only admins can view user list'
        //     ], 403);
        // }

        try {
            $users = User::all();
            $formattedUsers = $users->map(function($user) {
                $meta = json_decode($user->user_metadata ?? '{}', true) ?? [];
                $role = $user->role ?? ($meta['role'] ?? 'viewer');
                return [
                    'id' => $user->id,
                    'email' => $user->email,
                    'created_at' => $user->created_at,
                    'last_sign_in_at' => $user->last_sign_in_at ?? null,
                    'role' => $role,
                    'name' => $meta['name'] ?? $user->name,
                    'is_confirmed' => $user->email_verified_at ? true : false
                ];
            });

            return response()->json(['data' => $formattedUsers, 'total' => $formattedUsers->count()]);

        } catch (\Exception $e) {
            Log::error('Error fetching users', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Server error', 'msg' => $e->getMessage()], 500);
        }
    }

    /**
     * Update user role (Admin only)
     */
    public function updateRole(Request $request, $userId)
    {
        $userRole = $request->header('X-User-Role') ?? $request->get('auth_user_role');
        // if ($userRole !== 'admin') {
        //     return response()->json([
        //         'error' => 'Forbidden',
        //         'message' => 'Only admins can update user roles'
        //     ], 403);
        // }

        $validated = $request->validate([
            'role' => 'required|in:admin,editor,viewer'
        ]);

        try {
            $user = User::find($userId);
            if (!$user) return response()->json(['error' => 'User not found'], 404);

            $meta = json_decode($user->user_metadata ?? '{}', true) ?? [];
            $meta['role'] = $validated['role'];
            $user->user_metadata = json_encode($meta);
            $user->save();

            Log::info('User role updated', ['user_id' => $userId, 'new_role' => $validated['role'], 'updated_by' => $request->header('X-User-ID')]);

            return response()->json(['message' => 'User role updated successfully', 'role' => $validated['role'], 'user' => $user]);
        } catch (\Exception $e) {
            Log::error('Error updating user role', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString(), 'user_id' => $userId]);
            return response()->json(['error' => 'Server error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Delete user (Admin only)
     */
    public function destroy(Request $request, $userId)
    {
        // $userRole = $request->header('X-User-Role') ?? $request->get('auth_user_role');
        // if ($userRole !== 'admin') {
        //     return response()->json([
        //         'error' => 'Forbidden',
        //         'message' => 'Only admins can delete users'
        //     ], 403);
        // }

        try {
            $user = User::find($userId);
            if (!$user) return response()->json(['error' => 'User not found'], 404);

            $user->delete();

            Log::info('User deleted', ['user_id' => $userId, 'deleted_by' => $request->header('X-User-ID')]);

            return response()->json(['message' => 'User deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Error deleting user', ['error' => $e->getMessage(), 'user_id' => $userId]);
            return response()->json(['error' => 'Server error'], 500);
        }
    }
}