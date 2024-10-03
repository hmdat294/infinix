<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\user as ResourcesUser;
use App\Models\User;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        // if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {

        //     $user = User::where('email', $request->email)->first();

        //     $token = $user->createToken($user->id)->plainTextToken;

        //     return response()->json([
        //         'message' => 'Đăng nhập thành công!',
        //         'token' => $token
        //     ]);
        // } else {
        //     return response()->json(['message' => 'Đăng nhập không thành công!']);
        // }


        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = User::where('email', $request->email)->first();

            // Kiểm tra nếu email chưa được xác thực
            // if (!$user->hasVerifiedEmail()) {
            //     return response()->json([
            //         'message' => 'Bạn cần xác nhận email trước khi đăng nhập.'
            //     ]);
            // }

            // Tạo token nếu đăng nhập thành công và email đã xác thực
            $token = $user->createToken($user->id)->plainTextToken;

            return response()->json([
                'message' => 'Đăng nhập thành công!',
                'token' => $token
            ]);
        }
        else{   
            return response()->json(['message' => 'Đăng nhập không thành công.']);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Đăng xuất thành công!']);
    }
}
