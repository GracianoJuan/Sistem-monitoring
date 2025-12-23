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

            $token = Str::random(64);
            DB::table('password_reset_tokens')->insert([
                'email' => $user->email,
                'token' => $token,
                'created_at' => Carbon::now()
            ]);

            $confirmUrl = url('/api/auth/confirm?token=' . $token . '&email=' . urlencode($user->email));
            Mail::to($user->email)->send(new ConfirmAccountMail($user->name ?? 'User', $confirmUrl));

            DB::commit();

            return response()->json(['message' => 'Registered. Please check your email to confirm.']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Registration error', ['error' => $e->getMessage()]);
            return response()->json(['error' =>  $e->getMessage()], 500);
        }
    }

    public function confirm(Request $request)
    {
        $token = $request->query('token');
        $email = $request->query('email');

        if (!$token || !$email) {
            return response()->json(['error' => 'Invalid confirm link'], 400);
        }

        $row = DB::table('password_reset_tokens')->where('email', $email)->where('token', $token)->first();
        if (!$row) {
            return response()->json(['error' => 'Invalid or expired token'], 400);
        }

        $user = User::where('email', $email)->first();
        if (!$user) return response()->json(['error' => 'User not found'], 404);

        $user->email_verified_at = Carbon::now();
        $user->save();

        DB::table('password_reset_tokens')->where('email', $email)->delete();

        return response()->json(['message' => 'Email confirmed successfully']);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $validated['email'])->first();
        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        if (!$user->email_verified_at) {
            return response()->json(['error' => 'Email not verified'], 403);
        }

        // create session token with expiry 30 days
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

        return response()->json(['message' => 'Login successful', 'user' => $user, 'access_token' => $token])->cookie('session_token', $token, 60 * 24 * 7, '/', null, false, true);
    }

    public function logout(Request $request)
    {
        $token = $request->cookie('session_token') ?? $request->bearerToken();
        if ($token) {
            DB::table('sessions')->where('id', $token)->delete();
        }

        return response()->json(['message' => 'Logged out'])->withoutCookie('session_token');
    }

    public function sendReset(Request $request)
    {
        $validated = $request->validate(['email' => 'required|email']);
        $user = User::where('email', $validated['email'])->first();
        if (!$user) return response()->json(['message' => 'If the email exists, a reset link has been sent.']);

        DB::table('password_reset_tokens')->where('email', $user->email)->delete();

        $token = Str::random(64);
        DB::table('password_reset_tokens')->insert([
            'email' => $user->email,
            'token' => $token,
            'created_at' => Carbon::now()
        ]);

        $frontendUrl = env('APP_URL', 'http://localhost:8000');
        $resetUrl = $frontendUrl . '/login?token=' . $token . '&email=' . urlencode($user->email);
        
        Mail::to($user->email)->send(new ResetPasswordMail($user->name ?? 'User', $resetUrl));

        return response()->json(['message' => 'Reset link sent']);
    }

    public function verifyReset(Request $request)
    {
        $token = $request->query('token');
        $email = $request->query('email');

        if (!$token || !$email) return response()->json(['error' => 'Invalid token'], 400);

        $row = DB::table('password_reset_tokens')->where('email', $email)->where('token', $token)->first();
        if (!$row) return response()->json(['error' => 'Invalid or expired token'], 400);

        $created = Carbon::parse($row->created_at);
        if (Carbon::now()->diffInMinutes($created) > 60) {
            DB::table('password_reset_tokens')->where('email', $email)->delete();
            return response()->json(['error' => 'Token expired'], 400);
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

        $row = DB::table('password_reset_tokens')->where('email', $validated['email'])->where('token', $validated['token'])->first();
        if (!$row) return response()->json(['error' => 'Invalid token'], 400);

        $created = Carbon::parse($row->created_at);
        if (Carbon::now()->diffInMinutes($created) > 60) {
            DB::table('password_reset_tokens')->where('email', $validated['email'])->delete();
            return response()->json(['error' => 'Token expired'], 400);
        }

        $user = User::where('email', $validated['email'])->first();
        if (!$user) return response()->json(['error' => 'User not found'], 404);

        $user->password = Hash::make($validated['password']);
        $user->save();

        DB::table('password_reset_tokens')->where('email', $validated['email'])->delete();

        return response()->json(['message' => 'Password updated']);
    }

    public function me(Request $request)
    {
        $token = $request->cookie('session_token') ?? $request->bearerToken();
        if (!$token) return response()->json(['data' => ['session' => null], 'error' => null]);

        $session = DB::table('sessions')->where('id', $token)->first();
        if (!$session) return response()->json(['data' => ['session' => null], 'error' => null]);

        $user = User::find($session->user_id);
        if (!$user) return response()->json(['data' => ['session' => null], 'error' => null]);

        return response()->json(['data' => ['session' => [
            'access_token' => $token,
            'user' => $user
        ]], 'error' => null]);
    }
}