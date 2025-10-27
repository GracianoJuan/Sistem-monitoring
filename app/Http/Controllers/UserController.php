<?php

// app/Http/Controllers/UserController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    /**
     * Get all users (Admin only)
     */
    public function index(Request $request)
    {
        $userRole = $request->header('X-User-Role');
        
        if ($userRole !== 'admin') {
            return response()->json([
                'error' => 'Forbidden',
                'message' => 'Only admins can view user list'
            ], 403);
        }

        try {
            $supabaseUrl = config('services.supabase.supabase_url');
            $supabaseServiceKey = config('services.supabase.supabase_service_role');

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $supabaseServiceKey,
                'apikey' => $supabaseServiceKey
            ])->get($supabaseUrl . '/auth/v1/admin/users');

            if (!$response->successful()) {
                Log::error('Failed to fetch users from Supabase', [
                    'status' => $response->status(),
                ]);

                return response()->json([
                    'error' => 'Failed to fetch users',
                ], 500);
            }

            $users = $response->json();
            $formattedUsers = array_map(function($user) {
                return [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'created_at' => $user['created_at'],
                    'last_sign_in_at' => $user['last_sign_in_at'],
                    'role' => $user['user_metadata']['role'] ?? 'viewer',
                    'name' => $user['user_metadata']['name'] ?? 'No Name',
                    'is_confirmed' => $user['email_confirmed_at'] ? true : false
                ];
            }, $users['users'] ?? []);

            return response()->json([
                'data' => $formattedUsers,
                'total' => count($formattedUsers)
            ]);

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
        $userRole = $request->header('X-User-Role');
        
        if ($userRole !== 'admin') {
            return response()->json([
                'error' => 'Forbidden',
                'message' => 'Only admins can update user roles'
            ], 403);
        }

        $validated = $request->validate([
            'role' => 'required|in:admin,editor,viewer'
        ]);

        try {
            $supabaseUrl = config('services.supabase.supabase_url');
            $supabaseServiceKey = config('services.supabase.supabase_service_role');

            // CHANGED: Use PUT instead of PATCH
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $supabaseServiceKey,
                'apikey' => $supabaseServiceKey,
                'Content-Type' => 'application/json'
            ])->put($supabaseUrl . '/auth/v1/admin/users/' . $userId, [
                'user_metadata' => [
                    'role' => $validated['role']
                ]
            ]);

            if (!$response->successful()) {
                Log::error('Failed to update user role', [
                    'user_id' => $userId,
                    'status' => $response->status(),
                    'response_body' => $response->body(), // Added for debugging
                    'response_json' => $response->json()
                ]);

                return response()->json([
                    'error' => 'Failed to update user',
                    'details' => $response->json(), // Return error details
                    'status' => $response->status()
                ], $response->status());
            }

            Log::info('User role updated', [
                'user_id' => $userId,
                'new_role' => $validated['role'],
                'updated_by' => $request->header('X-User-ID')
            ]);

            return response()->json([
                'message' => 'User role updated successfully',
                'role' => $validated['role'],
                'user' => $response->json()
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating user role', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => $userId
            ]);

            return response()->json([
                'error' => 'Server error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete user (Admin only)
     */
    public function destroy(Request $request, $userId)
    {
        $userRole = $request->header('X-User-Role');
        
        if ($userRole !== 'admin') {
            return response()->json([
                'error' => 'Forbidden',
                'message' => 'Only admins can delete users'
            ], 403);
        }

        try {
            $supabaseUrl = config('services.supabase.supabase_url');
            $supabaseServiceKey = config('services.supabase.supabase_service_role');

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $supabaseServiceKey,
                'apikey' => $supabaseServiceKey
            ])->delete($supabaseUrl . '/auth/v1/admin/users/' . $userId);

            if (!$response->successful()) {
                Log::error('Failed to delete user', [
                    'user_id' => $userId,
                    'status' => $response->status(),
                    'response_body' => $response->body()
                ]);

                return response()->json([
                    'error' => 'Failed to delete user',
                    'details' => $response->json()
                ], $response->status());
            }

            Log::info('User deleted', [
                'user_id' => $userId,
                'deleted_by' => $request->header('X-User-ID')
            ]);

            return response()->json([
                'message' => 'User deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error deleting user', [
                'error' => $e->getMessage(),
                'user_id' => $userId
            ]);

            return response()->json(['error' => 'Server error'], 500);
        }
    }
}