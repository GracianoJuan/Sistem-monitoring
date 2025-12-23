<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;
use App\Mail\ConfirmAccountMail;
use App\Mail\ResetPasswordMail;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'name' => 'nullable|string|max:255'
        ]);

        DB::beginTransaction();
        try {
            $attrs = [
                'name' => $validated['name'] ?? null,
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ];

            if (Schema::hasColumn('users', 'role')) {
                $attrs['role'] = 'viewer';
            }

            if (Schema::hasColumn('users', 'user_metadata')) {
                $attrs['user_metadata'] = json_encode(['role' => 'viewer']);
            }

            $user = User::create($attrs);
            Log::info('User created', ['user_id' => $user->id, 'email' => $user->email]);

            $token = Str::random(64);
            
            // Delete any existing tokens for this email
            DB::table('password_reset_tokens')->where('email', $user->email)->delete();
            
            // Insert new token
            DB::table('password_reset_tokens')->insert([
                'email' => $user->email,
                'token' => $token,
                'created_at' => Carbon::now()
            ]);
            Log::info('Token created', ['email' => $user->email]);

            $frontendUrl = env('APP_URL', 'http://localhost:8000');
            $confirmUrl = $frontendUrl . '/confirm-email?token=' . $token . '&email=' . urlencode($user->email);
            
            // Try to send email, but don't fail registration if email fails
            try {
                Mail::to($user->email)->send(new ConfirmAccountMail($user->name ?? 'User', $confirmUrl));
                Log::info('Confirmation email sent', ['email' => $user->email]);
            } catch (\Exception $mailError) {
                Log::error('Email sending failed', [
                    'error' => $mailError->getMessage(),
                    'email' => $user->email
                ]);
                // Continue anyway - user can request new confirmation email
            }

            DB::commit();

            return response()->json([
                'message' => 'Registered successfully. Please check your email to confirm your account.',
                'debug' => [
                    'token_created' => true,
                    'confirmation_url' => $confirmUrl // Remove this in production
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Registration error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function confirm(Request $request)
    {
        $token = $request->query('token');
        $email = $request->query('email');

        Log::info('Confirm attempt', ['token' => substr($token, 0, 10) . '...', 'email' => $email]);

        if (!$token || !$email) {
            return response()->json(['error' => 'Invalid confirmation link'], 400);
        }

        $row = DB::table('password_reset_tokens')
            ->where('email', $email)
            ->where('token', $token)
            ->first();
            
        if (!$row) {
            Log::warning('Token not found', ['email' => $email]);
            return response()->json(['error' => 'Invalid or expired token'], 400);
        }

        // Check if token is older than 24 hours
        $created = Carbon::parse($row->created_at);
        if (Carbon::now()->diffInHours($created) > 24) {
            DB::table('password_reset_tokens')->where('email', $email)->delete();
            Log::warning('Token expired', ['email' => $email]);
            return response()->json(['error' => 'Token expired. Please register again.'], 400);
        }

        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->email_verified_at = Carbon::now();
        $user->save();

        DB::table('password_reset_tokens')->where('email', $email)->delete();
        
        Log::info('Email confirmed', ['email' => $email]);

        return response()->json(['message' => 'Email confirmed successfully! You can now log in.']);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $validated['email'])->first();
        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json(['error' => 'Invalid email or password'], 401);
        }

        if (!$user->email_verified_at) {
            return response()->json(['error' => 'Please verify your email before logging in'], 403);
        }

        // Create session token that lasts 30 days
        $token = Str::random(64);
        $expires = Carbon::now()->addDays(30);
        DB::table('sessions')->insert([
            'id' => $token,
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->header('User-Agent'),
            'payload' => json_encode(['expires_at' => $expires->toDateTimeString()]),
            'last_activity' => time()
        ]);

        return response()->json([
            'message' => 'Login successful', 
            'user' => $user, 
            'access_token' => $token
        ])->cookie('session_token', $token, 60 * 24 * 30, '/', null, false, true);
    }

    public function logout(Request $request)
    {
        $token = $request->cookie('session_token') ?? $request->bearerToken();
        if ($token) {
            DB::table('sessions')->where('id', $token)->delete();
        }

        return response()->json(['message' => 'Logged out successfully'])
            ->withoutCookie('session_token');
    }

    public function sendReset(Request $request)
    {
        $validated = $request->validate(['email' => 'required|email']);
        $user = User::where('email', $validated['email'])->first();
        
        if (!$user) {
            // Don't reveal if email exists or not for security
            return response()->json(['message' => 'If the email exists, a reset link has been sent.']);
        }

        // Delete old tokens
        DB::table('password_reset_tokens')->where('email', $user->email)->delete();

        $token = Str::random(64);
        DB::table('password_reset_tokens')->insert([
            'email' => $user->email,
            'token' => $token,
            'created_at' => Carbon::now()
        ]);
        
        Log::info('Reset token created', ['email' => $user->email]);

        $frontendUrl = env('APP_URL', 'http://localhost:8000');
        $resetUrl = $frontendUrl . '/login?token=' . $token . '&email=' . urlencode($user->email);
        
        try {
            Mail::to($user->email)->send(new ResetPasswordMail($user->name ?? 'User', $resetUrl));
            Log::info('Reset email sent', ['email' => $user->email]);
        } catch (\Exception $mailError) {
            Log::error('Reset email failed', [
                'error' => $mailError->getMessage(),
                'email' => $user->email
            ]);
        }

        return response()->json([
            'message' => 'Password reset link has been sent to your email.',
            'debug' => [
                'reset_url' => $resetUrl // Remove this in production
            ]
        ]);
    }

    public function verifyReset(Request $request)
    {
        $token = $request->query('token');
        $email = $request->query('email');

        if (!$token || !$email) {
            return response()->json(['error' => 'Invalid reset link'], 400);
        }

        $row = DB::table('password_reset_tokens')
            ->where('email', $email)
            ->where('token', $token)
            ->first();
            
        if (!$row) {
            Log::warning('Reset token not found', ['email' => $email]);
            return response()->json(['error' => 'Invalid or expired reset token'], 400);
        }

        $created = Carbon::parse($row->created_at);
        if (Carbon::now()->diffInMinutes($created) > 60) {
            DB::table('password_reset_tokens')->where('email', $email)->delete();
            Log::warning('Reset token expired', ['email' => $email]);
            return response()->json(['error' => 'Reset link expired. Please request a new one.'], 400);
        }

        return response()->json(['message' => 'Token valid']);
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'token' => 'required',
            'password' => 'required|min:6'
        ]);

        $row = DB::table('password_reset_tokens')
            ->where('email', $validated['email'])
            ->where('token', $validated['token'])
            ->first();
            
        if (!$row) {
            Log::warning('Password update: token not found', ['email' => $validated['email']]);
            return response()->json(['error' => 'Invalid reset token'], 400);
        }

        $created = Carbon::parse($row->created_at);
        if (Carbon::now()->diffInMinutes($created) > 60) {
            DB::table('password_reset_tokens')->where('email', $validated['email'])->delete();
            Log::warning('Password update: token expired', ['email' => $validated['email']]);
            return response()->json(['error' => 'Reset link expired. Please request a new one.'], 400);
        }

        $user = User::where('email', $validated['email'])->first();
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Update password
        $user->password = Hash::make($validated['password']);
        $user->save();

        // Delete all reset tokens for this email
        DB::table('password_reset_tokens')->where('email', $validated['email'])->delete();

        // Optionally, delete all existing sessions for security
        DB::table('sessions')->where('user_id', $user->id)->delete();

        Log::info('Password updated successfully', ['email' => $validated['email']]);

        return response()->json(['message' => 'Password updated successfully! You can now log in with your new password.']);
    }

    public function me(Request $request)
    {
        $token = $request->cookie('session_token') ?? $request->bearerToken();
        if (!$token) {
            return response()->json(['data' => ['session' => null], 'error' => null]);
        }

        $session = DB::table('sessions')->where('id', $token)->first();
        if (!$session) {
            return response()->json(['data' => ['session' => null], 'error' => null]);
        }

        $user = User::find($session->user_id);
        if (!$user) {
            return response()->json(['data' => ['session' => null], 'error' => null]);
        }

        return response()->json([
            'data' => [
                'session' => [
                    'access_token' => $token,
                    'user' => $user
                ]
            ], 
            'error' => null
        ]);
    }
}