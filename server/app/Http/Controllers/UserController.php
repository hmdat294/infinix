<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\Profile as ProfileModel;
use Illuminate\Http\Request;
use App\Models\User as UserModel;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UserController extends Controller
{
    /**
     * Danh sách người dùng
     * 
     * @return AnonymousResourceCollection
     */
    // public function index()
    // {
    //     if (request()->has('search')) {
    //         $users = UserModel::whereHas('profile', function ($query) {
    //             $query->where('display_name', 'like', '%' . request('search') . '%');
    //         })->get();
    //         return UserResource::collection($users);
    //     }
        
    //     $users = UserModel::paginate(10);
    //     return UserResource::collection($users)->additional([
    //         'meta' => [
    //             'current_page' => $users->currentPage(),
    //             'last_page' => $users->lastPage(),
    //             'per_page' => $users->perPage(),
    //             'total' => $users->total(),
    //         ]
    //     ]);
    // }
    public function index()
    {   
        $users = UserModel::all();
        return UserResource::collection($users);
    }

    /**
     * Hiển thị thông tin người dùng
     * 
     * @param string $id : Id người dùng, mặc định là người dùng hiện tại đang đăng nhập nếu không truyền id
     * 
     * @return UserResource
     */
    public function show($id = 0)
    {
        return new UserResource(UserModel::find($id == 0 ? request()->user()->id : $id));
    }

    public function update(Request $request)
    {
        $user = UserModel::find($request->user()->id);
        $user->update($request->only(['username', 'email', 'password', 'theme', 'language', 'phone_number']));
        $user->profile->update($request->only(['display_name', 'biography', 'date_of_birth', 'address', 'gender']));
        
        if ($request->has('profile_photo')) {
            $path = $request->file('profile_photo')->store('uploads', 'public');
            $user->profile->update(['profile_photo' => asset('storage/' . $path)]);
        }

        if ($request->has('cover_photo')) {
            $path = $request->file('cover_photo')->store('uploads', 'public');
            $user->profile->update(['cover_photo' => asset('storage/' . $path)]);
        }

        return new UserResource($user);
    }
}
