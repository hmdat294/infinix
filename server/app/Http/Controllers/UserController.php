<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Models\User as UserModel;

class UserController extends Controller
{
    public function index()
    {
        $users = UserModel::paginate(10);
        return UserResource::collection($users)->additional([
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ]
        ]);
    }

    public function show($id)
    {
        $user = UserModel::find($id);
        return new UserResource($user);
    }
}
