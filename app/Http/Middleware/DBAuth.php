<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class DBAuth
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->cookie('session_token') ?? $request->bearerToken();

        if (!$token) {
            return response()->json([
                'error' => 'Unauthorized', 
                'message' => 'No authentication token provided'
            ], 401);
        }

        try {
            // Get session
            $session = DB::table('sessions')->where('id', $token)->first();
            
            if (!$session) {
                return response()->json([
                    'error' => 'Unauthorized', 
                    'message' => 'Invalid session token'
                ], 401);
            }

            // Check expiration from payload
            if (isset($session->payload)) {
                $payload = @json_decode($session->payload, true) ?? [];
                $expiresAt = $payload['expires_at'] ?? null;

                if ($expiresAt && Carbon::now()->greaterThan(Carbon::parse($expiresAt))) {
                    DB::table('sessions')->where('id', $token)->delete();
                    return response()->json([
                        'error' => 'Unauthorized', 
                        'message' => 'Session expired'
                    ], 401);
                }
            }

            // Get user data
            $user = DB::table('users')->where('id', $session->user_id)->first();
            
            if (!$user) {
                return response()->json([
                    'error' => 'Unauthorized', 
                    'message' => 'User not found'
                ], 401);
            }

            // Get user role - prioritas dari kolom role
            $userRole = $user->role ?? 'viewer';

            // Update last_sign_in_at jika perlu (optional)
            // DB::table('users')->where('id', $user->id)->update(['last_sign_in_at' => Carbon::now()]);

            // Attach user data to request
            $request->merge([
                'auth_user' => $user,
                'auth_user_id' => $user->id,
                'auth_user_email' => $user->email,
                'auth_user_name' => $user->name,
                'auth_user_role' => $userRole
            ]);

        } catch (\Exception $e) {
            Log::error('DB authentication error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'error' => 'Authentication failed',
                'message' => 'An error occurred during authentication'
            ], 401);
        }

        return $next($request);
    }
}