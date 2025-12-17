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
            return response()->json(['error' => 'Unauthorized', 'message' => 'No authentication token provided'], 401);
        }

        try {
            $session = DB::table('sessions')->where('id', $token)->first();
            if (!$session) {
                return response()->json(['error' => 'Unauthorized', 'message' => 'Invalid session token'], 401);
            }

            // If payload contains expires_at, enforce it
            $expiresAt = null;
            if (isset($session->payload)) {
                $payload = @json_decode($session->payload, true) ?? [];
                $expiresAt = $payload['expires_at'] ?? null;
            }

            if ($expiresAt && Carbon::now()->greaterThan(Carbon::parse($expiresAt))) {
                DB::table('sessions')->where('id', $token)->delete();
                return response()->json(['error' => 'Unauthorized', 'message' => 'Session expired'], 401);
            }

            $user = DB::table('users')->where('id', $session->user_id)->first();
            $userRole = 'viewer';
            if ($user) {
                if (!empty($user->role)) {
                    $userRole = $user->role;
                } elseif (isset($user->user_metadata)) {
                    $meta = json_decode($user->user_metadata, true) ?? [];
                    $userRole = $meta['role'] ?? 'viewer';
                }
            }

            $request->merge([
                'auth_user' => $user,
                'auth_user_id' => $user->id ?? null,
                'auth_user_email' => $user->email ?? null,
                'auth_user_role' => $userRole
            ]);
        } catch (\Exception $e) {
            Log::error('DB authentication error', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Authentication failed'], 401);
        }

        return $next($request);
    }
}
