<?php

namespace App\Http\Controllers;

use App\Http\Requests\auth\LoginUserRequest;
use App\Http\Requests\auth\RegisterUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(LoginUserRequest $request)
    {
        if (!Auth::attempt([
            'email' => $request['email'],
            'password' => $request['password']
        ])) {
            return response()->noContent(401);
        }

        $request->session()->regenerate();

        return response()->noContent();
    }

    public function register(RegisterUserRequest $request) {
        User::create([
            'username' => $request['username'],
            'email' => $request['email'],
            'password' => $request['password']
        ]);
        return response()->noContent();
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }

    public function user(Request $request)
    {
        return $request->user();
    }
}
