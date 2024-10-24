<?php

namespace App\Http\Controllers;

use App\Events\UserConnectionEvent;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User as UserModel;
use App\Models\Permission as PermissionModel;
use App\Models\Profile as ProfileModel;
use Illuminate\Http\JsonResponse;
use App\Models\User;

class AuthController extends Controller
{

    /**
     * Đăng nhập
     *
     * @param Request $request
     * 
     * @bodyParam email : Tên đăng nhập của người dùng.
     * @bodyParam password : Mật khẩu của người dùng.
     *
     * @response 200 : Đăng nhập thành công
     * @response 403 : Không có quyền đăng nhập
     * @response 422 : Thông tin đăng nhập không hợp lệ
     *
     * @return JsonResponse
     */
    public function login(Request $request)
    {

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Tài khoản hoặc mật khẩu không chính xác!',
            ]); //status: 422
        }

        $user = UserModel::find(Auth::user()->id);
        if (!$user->permissions->contains('name', 'can_login')) {
            return response()->json([
                'message' => 'Tài khoản hiện đang bị hạn chế!',
            ]); //status: 403
        }

        $user->update(['last_activity' => now()]);

        broadcast(new UserConnectionEvent($user, 'online'))->toOthers();

        return response()->json([
            'token' => $user->createToken($user->id)->plainTextToken,
            'message' => 'Đăng nhập thành công!',
        ]); //status: 200
    }


    /**
     * Đăng ký
     *
     * @param Request $request
     * 
     * @bodyParam fullname : Tên hiển thị của người dùng.
     * @bodyParam email : Email đăng nhập.
     * @bodyParam password : Mật khẩu của người dùng.
     *
     * @response 200 : Đăng ký thành công
     * @response 422 : Email đã tồn tại
     *
     * @return JsonResponse
     */
    public function register(Request $request)
    {
        // if (UserModel::where('email', $request->email)->exists()) {
        //     return response()->json([
        //         'message' => 'Email đã được đăng ký!',
        //     ]); // status: 422
        // }

        $user = UserModel::create([
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'password' => Hash::make($request->password),
            'last_activity' => now(),
        ]);

        $profile = ProfileModel::create([
            'user_id' => $user->id,
            'display_name' => $request->fullname,
        ]);

        // $user->permissions()->attach(PermissionModel::all()->pluck('id')->toArray());
        // attach permission expect can_access_dashboard
        $user->permissions()->attach(PermissionModel::where('name', '!=', 'can_access_dashboard')->pluck('id')->toArray());

        return response()->json([
            'token' => $user->createToken($user->id)->plainTextToken,
            'message' => 'Đăng ký thành công!',
        ]); // status: 200
    }

    /**
     * Đăng xuất
     *
     * @param Request $request
     *
     * @response 200 : Đăng xuất thành công
     *
     * @return JsonResponse
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        broadcast(new UserConnectionEvent($request->user(), 'offline'))->toOthers();

        return response()->json([
            'message' => 'Logout successful.',
        ], 200);
    }
}
