
<?php

// Create this file: app/Http/Middleware/CheckRole.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CheckRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $userRole = $request->header('X-User-Role');
        
        if (!$userRole) {
            return response()->json([
                'error' => 'Unauthorized',
                'message' => 'User role not found'
            ], 403);
        }

        // Check if user's role is in the allowed roles
        if (!in_array($userRole, $roles)) {
            Log::warning('Unauthorized role access attempt', [
                'user_role' => $userRole,
                'allowed_roles' => $roles,
                'endpoint' => $request->path()
            ]);

            return response()->json([
                'error' => 'Forbidden',
                'message' => 'You do not have permission to access this resource'
            ], 403);
        }

        return $next($request);
    }
}