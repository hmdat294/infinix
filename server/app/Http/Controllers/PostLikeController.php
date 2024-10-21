<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Models\Post as PostModel;
use App\Models\PostLike as PostLikeModel;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;
use App\Events\UserLikePostEvent;

class PostLikeController extends Controller
{
    
    /**
     * Danh sách user đã like bài viết
     *
     * @param Request $request
     * 
     * @bodyParam post_id : id của bài viết.
     * 
     * @return AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $post = PostModel::find($request->post_id);
        $post_likes = $post->likes;
        $users = $post_likes->user;

        return UserResource::collection($users);
    }


    /**
     * Like bài viết
     *
     * @param Request $request
     * 
     * @bodyParam post_id : id của bài viết.
     * 
     * @return JsonResponse
     */
    public function store(Request $request)
    {
        $post_like = PostLikeModel::where('post_id', $request->post_id)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($post_like) {

            $post_like->delete();
            
            return response()->json([
                'message' => 'Đã hủy thích bài viết',
            ], 200);

        } else {

            PostLikeModel::create([
                'post_id' => $request->post_id,
                'user_id' => $request->user()->id,
            ]);

            event(new UserLikePostEvent($request->post_id, $request->user()->id));

            return response()->json([
                'message' => 'Đã thích bài viết',
            ], 200);
        }
    }
}
