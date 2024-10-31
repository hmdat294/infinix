<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post as PostModel;
use App\Models\PostBookmark as PostBookmarkModel;
use App\Http\Resources\UserResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;

class PostBookmarkController extends Controller
{

    public function index(Request $request, string $post_id)
    {
        $post = PostModel::find($post_id);
        $post_bookmarks = $post->bookmarks;
        $users = $post_bookmarks->user;

        return UserResource::collection($users);
    }

    /**
     * Bookmark bài viết
     *
     * @param Request $request
     * 
     * @bodyParam post_id : id của bài viết.
     * 
     * @return JsonResponse
     */
    public function store(Request $request, string $post_id)
    {
        $post_bookmark = PostBookmarkModel::where('post_id', $post_id)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($post_bookmark) {

            $post_bookmark->delete();
            
            return response()->json([
                'message' => 'Đã hủy lưu bài viết',
            ], 200);

        } else {

            PostBookmarkModel::create([
                'post_id' => $request->post_id,
                'user_id' => $request->user()->id,
            ]);

            return response()->json([
                'message' => 'Lưu thành công',
            ], 200);
        }
    }
}
