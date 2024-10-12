<?php

namespace App\Http\Controllers;

use App\Http\Resources\CommentResource;
use App\Events\UserCommentEvent;
use Illuminate\Http\Request;
use App\Models\PostComment as CommentModel;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;
use App\Models\Post as PostModel;

class CommentController extends Controller
{
    /**
     * Danh sách bình luận hoặc bình luận của một bài viết (nếu có post_id)
     * 
     * @param Request $request
     * @param string $post_id
     * 
     * @return AnonymousResourceCollection
     */
    public function index(Request $request, string $post_id = null)
    {
        if ($post_id) {
            $comments = CommentModel::where('post_id', $post_id)->orderBy('created_at', 'desc')->get();
            return CommentResource::collection($comments);
        } else {
            $comments = CommentModel::orderBy('created_at', 'desc')->paginate(10);
            return CommentResource::collection($comments)->additional([
                'meta' => [
                    'current_page' => $comments->currentPage(),
                    'last_page' => $comments->lastPage(),
                    'per_page' => $comments->perPage(),
                    'total' => $comments->total(),
                ]
            ]);
        }
    }


    /**
     * Tạo bình luận
     * 
     * @param Request $request
     * 
     * @bodyParam post_id : Id của bài viết mà bình luận thuộc về.
     * @bodyParam content : Nội dung bình luận.
     * 
     * @response 201 : Bình luận được tạo thành công
     * @response 404 : Bài viết không tồn tại
     * 
     * @return CommentResource | JsonResponse
     */
    public function store(Request $request)
    {
        if (!PostModel::find($request->post_id)) {
            return response()->json([
                'message' => 'Post not found.',
            ], 404);
        }

        $comment_data = $request->only('post_id', 'content');
        $comment_data['user_id'] = $request->user()->id;
        $comment = CommentModel::create($comment_data);

        broadcast(new UserCommentEvent($comment->user_id, $comment->post_id, $comment->id, $comment->content))->toOthers();

        return new CommentResource($comment);
    }


    /**
     * Xem chi tiết bình luận
     * 
     * @param string $id
     * 
     * @response 200 : Thông tin chi tiết bình luận
     * @response 404 : Bình luận không tồn tại
     * 
     * @return CommentResource | JsonResponse
     */
    public function show(string $id)
    {
        if (!CommentModel::find($id)) {
            return response()->json([
                'message' => 'Comment not found.',
            ], 404);
        }

        $comment = CommentModel::find($id);

        return new CommentResource($comment);
    }

    /**
     * Cập nhật bình luận
     * 
     * @param Request $request
     * @param string $id
     * 
     * @bodyParam content : Nội dung bình luận mới.
     * 
     * @response 200 : Bình luận được cập nhật thành công
     * @response 404 : Bình luận không tồn tại
     * 
     * @return CommentResource | JsonResponse 
     */
    public function update(Request $request, string $id)
    {
        if (!CommentModel::find($id)) {
            return response()->json([
                'message' => 'Comment not found.',
            ], 404);
        }

        $comment = CommentModel::find($id);
        $comment->update($request->only('content'));

        return new CommentResource($comment);
    }
    
    public function destroy(string $id)
    {
        CommentModel::destroy($id);
    }
}