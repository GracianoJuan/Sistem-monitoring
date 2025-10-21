<?php

// app/Http/Middleware/SupabaseAuth.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SupabaseAuth
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();
        $userEmail = $request->header('X-User-Email');
        $userId = $request->header('X-User-ID');

        if (!$token) {
            return response()->json([
                'error' => 'Unauthorized',
                'message' => 'No authentication token provided'
            ], 401);
        }

        try {
            $supabaseUrl = env('SUPABASE_URL');
            $supabaseServiceKey = env('SUPABASE_SERVICE_ROLE_KEY');

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $supabaseServiceKey,
                'apikey' => $supabaseServiceKey
            ])->get($supabaseUrl . '/auth/v1/admin/users', [
                'access_token' => $token
            ]);

            if (!$response->successful()) {
                Log::warning('Supabase token verification failed', [
                    'status' => $response->status(),
                ]);

                return response()->json([
                    'error' => 'Unauthorized',
                    'message' => 'Invalid authentication token'
                ], 401);
            }

            $user = $response->json();
            $userRole = $user['user_metadata']['role'] ?? 'viewer';

            // Add user info to request for use in controllers
            $request->merge([
                'auth_user' => $user,
                'auth_user_id' => $userId,
                'auth_user_email' => $userEmail,
                'auth_user_role' => $userRole
            ]);

            Log::info('Authenticated request', [
                'user_email' => $userEmail,
                'user_role' => $userRole,
                'endpoint' => $request->path()
            ]);
        } catch (\Exception $e) {
            Log::error('Supabase authentication error', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'Authentication failed',
                'message' => 'Unable to verify authentication token'
            ], 401);
        }

        return $next($request);
    }
}