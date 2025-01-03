<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Http\Resources\PostResource;
use Illuminate\Http\Request;
use App\Models\User as UserModel;
use App\Models\Post as PostModel;
use Illuminate\Support\Facades\Log;

class SearchController extends Controller
{
    public function user(Request $request, string $keyword, $limit = null)
    {

        $users = UserModel::whereHas('profile', function ($query) use ($keyword) {
            $query->where('display_name', 'like', '%' . $keyword . '%')
                ->orWhere('email', 'like', '%' . $keyword . '%');
        });
        Log::info('user_ids: ' . $users->pluck('id'));

        // loại trừ bản thân
        $users = $users->where('id', '!=', $request->user()->id);
        Log::info('user_ids: ' . $users->pluck('id'));

        $blocked_by_ids = $request->user()->blockedBy->pluck('id');
        Log::info('blocked_by_ids: ' . $blocked_by_ids);
        $blocked_ids = $request->user()->blockings->pluck('id');
        Log::info('blocked_ids: ' . $blocked_ids);

        $users = $users->whereNotIn('id', $blocked_by_ids)
            ->whereNotIn('id', $blocked_ids);


        Log::info('user_ids: ' . $users->pluck('id'));

        if ($limit) {
            $users = $users->limit($limit);
        }

        $users = $users->get();
        Log::info('response: ' . $users);
        return UserResource::collection($users);
    }

    public function post(Request $request, string $keyword, $limit = null)
    {

        $posts = PostModel::where('content', 'like', '%' . $keyword . '%');
        // Log::info($posts->get());

        $blocked_by_ids = $request->user()->blockedBy->pluck('blocker_id');
        $blocked_ids = $request->user()->blockings->pluck('blocked_id');
        $reported_user_ids = $request->user()->reportings->pluck('user_id');

        $user_ids = UserModel::whereNotIn('id', $blocked_by_ids)
            ->whereNotIn('id', $blocked_ids)
            ->whereNotIn('id', $reported_user_ids)
            ->pluck('id');

        $posts = $posts->whereNotIn('user_id', $user_ids);

        if ($limit) {
            $posts = $posts->limit($limit);
        }

        $posts = $posts->get();

        return PostResource::collection($posts);
    }

    public function all(Request $request, string $keyword)
    {
        $users_collection = $this->user($request, $keyword, 5);
        $posts_collection = $this->post($request, $keyword, 5);

        return [
            'users' => $users_collection,
            'posts' => $posts_collection,
        ];
    }
}
