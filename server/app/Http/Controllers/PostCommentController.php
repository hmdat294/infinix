<?php

namespace App\Http\Controllers;

use App\Http\Resources\PostCommentResource;
use App\Events\UserCommentPostEvent;
use Illuminate\Http\Request;
use App\Models\PostComment as CommentModel;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;
use App\Models\Post as PostModel;

class PostCommentController extends Controller
{
    /**
     * Danh sách bình luận hoặc bình luận của một bài viết (nếu có post_id)
     * 
     * @param Request $request
     * 
     * @bodyParam string $post_id : Id của bài viết.
     * 
     * @return AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $post_id = $request->post_id;
        $comments = CommentModel::where('post_id', $post_id)->orderBy('created_at', 'desc')->get();
        return PostCommentResource::collection($comments);

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
     * @return PostCommentResource | JsonResponse
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

        event(new UserCommentPostEvent($comment->user_id, $comment->post_id, $comment->id, $comment->content));

        return new PostCommentResource($comment);
    }


    /**
     * Xem chi tiết bình luận
     * 
     * @param string $id
     * 
     * @response 200 : Thông tin chi tiết bình luận
     * @response 404 : Bình luận không tồn tại
     * 
     * @return PostCommentResource | JsonResponse
     */
    public function show(string $id)
    {
        if (!CommentModel::find($id)) {
            return response()->json([
                'message' => 'Comment not found.',
            ], 404);
        }

        $comment = CommentModel::find($id);

        return new PostCommentResource($comment);
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
     * @return PostCommentResource | JsonResponse 
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

        return new PostCommentResource($comment);
    }
    
    /**
     * Xóa bình luận
     * 
     * @param string $id
     * 
     * @response 204 : Bình luận được xóa thành công
     * 
     * @return void | JsonResponse
     */
    public function destroy(string $id)
    {
        CommentModel::destroy($id);

        return response()->json([
            'message' => 'Comment deleted.',
        ], 204);
    }

    /**
     * Danh sách người dùng thích bình luận
     * 
     * @param string $id
     * 
     * @return JsonResponse
     */
    public function likes(string $id)
    {
        $comment = CommentModel::find($id);
        $likes = $comment->likes;
        return response()->json($likes);
    }

    /**
     * Thích bình luận
     * 
     * @param string $id
     * 
     * @return JsonResponse
     */
    public function like_post(Request $request, string $id)
    {
        $comment = CommentModel::find($id);

        if ($comment->likes->contains($request->user()->id)) {
            $comment->likes()->detach($request->user()->id);
            return response()->json([
                'message' => 'Unlike comment successfully.',
            ], 200);

        } else {
            $comment->likes()->attach($request->user()->id);
            return response()->json([
                'message' => 'Like comment successfully.',
            ], 200);

        }
    }
}
