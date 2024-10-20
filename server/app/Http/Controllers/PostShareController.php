<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post as PostModel;
use App\Models\PostShare as PostShareModel;
use App\Http\Resources\UserResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;
use App\Events\UserSharePostEvent;

class PostShareController extends Controller
{
    /**
     * Danh sách user đã share bài viết
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
        $post_shares = $post->shares;
        $users = $post_shares->user;

        return UserResource::collection($users);
    }

    /**
     * Share bài viết
     *
     * @param Request $request
     * 
     * @bodyParam post_id : id của bài viết.
     * 
     * @return 
     */
    public function store(Request $request)
    {
        $post_share = PostShareModel::where('post_id', $request->post_id)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($post_share) {
            $post_share->delete();
            return response()->json([
                'message' => 'Đã hủy chia sẻ bài viết',
            ], 200);
        } else {
            PostShareModel::create([
                'post_id' => $request->post_id,
                'user_id' => $request->user()->id,
            ]);

            event(new UserSharePostEvent($request->post_id, $request->user()->id));

            return response()->json([
                'message' => 'Chia sẻ thành công',
            ], 200);
        }
    }
}
