<?php

namespace App\Http\Controllers;

use App\Events\UserRegisteredEvent;
use App\Events\UserLoggedInEvent;
use App\Events\UserLoggedOutEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User as UserModel;

use function Pest\Laravel\json;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);
    
        if (!Auth::attempt($request->only('username', 'password'))) {
            return response()->json([
                'message' => 'Incorrect login information.',
            ], 422);
        }
    
        $user = UserModel::find(Auth::user()->id);
        event(new UserLoggedInEvent($user));
    
        return response()->json([
            'token' => $user->createToken($user->id)->plainTextToken,
            'message' => 'Login successful.',
        ], 200);
    }


    
    public function register(Request $request)
    {
        try {
            $request->validate([
                'username' => ['required', 'string', 'max:255', 'unique:'.UserModel::class],
                'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.UserModel::class],
                'phone_number' => ['nullable', 'string', 'max:255', 'unique:'.UserModel::class],
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'User already exists.',
                'errors' => $e->errors(),
            ], 422);
        }


        $user = UserModel::create([
            'username' => $request->username,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'password' => Hash::make($request->password),
            'last_activity' => now(),
        ]);

        event(new UserRegisteredEvent($user));

        return response()->json([
            'token' => $user->createToken($user->id)->plainTextToken,
            'message' => 'Registration successful.',
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        event(new UserLoggedOutEvent($request->user()));

        return response()->json([
            'message' => 'Logout successful.',
        ], 200);
    }
}
