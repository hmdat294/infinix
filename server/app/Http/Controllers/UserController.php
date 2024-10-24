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

    public function update(Request $request, $id)
    {
        $user = UserModel::find($id);
        $user->update($request->all());
        return new UserResource($user);
    }
}
