<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Http\Resources\PostResource;
use Illuminate\Http\Request;
use App\Models\User as UserModel;
use App\Models\Post as PostModel;

class SearchController extends Controller
{
    public function user(Request $request)
    {
        $keyword = $request->input('keyword');

        $users = UserModel::whereHas('profile', function ($query) use ($keyword) {
            $query->where('display_name', 'like', '%' . $keyword . '%');
        })->get();

        return UserResource::collection($users);
    }

    public function post(Request $request)
    {
        $keyword = $request->input('keyword');
        $posts = PostModel::where('content', 'like', "%$keyword%")->get();
        
        return PostResource::collection($posts);
    }

    public function all(Request $request)
    {
        $users_collection = $this->user($request);
        $posts_collection = $this->post($request);
        
        return [
            'users' => $users_collection,
            'posts' => $posts_collection,
        ];
    }
}
