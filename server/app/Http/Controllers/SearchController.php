<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Http\Resources\PostResource;
use Illuminate\Http\Request;
use App\Models\User as UserModel;
use App\Models\Post as PostModel;

class SearchController extends Controller
{
    public function user(Request $request, string $keyword, $limit = null)
    {

        $users = UserModel::whereHas('profile', function ($query) use ($keyword) {
            $query->where('display_name', 'like', '%' . $keyword . '%')
                  ->orWhere('email', 'like', '%' . $keyword . '%');
        });

        // loại trừ bản thân
        $users = $users->where('id', '!=', $request->user()->id);

        if ($limit) {
            $users = $users->limit($limit);
        }

        $users = $users->get();

        return UserResource::collection($users);
    }

    public function post(Request $request, string $keyword, $limit = null)
    {

        $posts = PostModel::where('content', 'like', "%$keyword%");

        if ($limit) {
            $posts = $posts->limit($limit);
        }

        $posts = $posts->get();
        
        return PostResource::collection($posts);
    }

    public function all(Request $request, string $keyword)
    {
        $users_collection = $this->user($request, $keyword, 20);
        $posts_collection = $this->post($request, $keyword, 20);
        
        return [
            'users' => $users_collection,
            'posts' => $posts_collection,
        ];
    }
}
