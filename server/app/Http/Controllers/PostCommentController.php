<?php

namespace App\Http\Controllers;

use App\Http\Resources\CommentResource;
use App\Events\UserCommentPostEvent;
use Illuminate\Http\Request;
use App\Models\PostComment as CommentModel;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;
use App\Models\Post as PostModel;
use Illuminate\Support\Facades\Log;
use App\Models\Notification as NotificationModel;
use App\Models\User as UserModel;
use App\Models\DisabledNotification as DisabledNotificationModel;

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
        return CommentResource::collection($comments);

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

        // if has media
        if ($request->hasFile('media')) {
            $media = $request->file('media');
            $media_path =  $media->store('uploads', 'public');
            $media_type = $media->getClientMimeType();
            $comment_data['media'] = asset('storage/' . $media_path);
            $comment_data['media_type'] = $media_type;
        }

        $comment = CommentModel::create($comment_data);
        $post = PostModel::find($request->post_id);
        event(new UserCommentPostEvent($comment->user_id, $comment->post_id, $comment->id, $comment->content, "comment"));
        $this->sendNotification($post->user_id, $comment->post_id, $comment->id);
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

            $comment = CommentModel::find($id);
    
            event(new UserCommentPostEvent($comment->user_id, $comment->post_id, $comment->id, $comment->content, "delete_comment"));
            
            CommentModel::destroy($id);


        return response()->json([
            'message' => 'Comment deleted.',
        ], 204);
    }

    public function sendNotification($user_id, $post_id, $comment_id)
    {
        $post = PostModel::find($post_id);
        
        $post_notification_disabled = DisabledNotificationModel::where('user_id', $post->user_id)->where('post_id', $post_id)->exists();

        $target_user_notification_disabled = DisabledNotificationModel::where('user_id', PostModel::find($post_id)->user_id)->where('target_user_id', $user_id)->exists();

        if($post_notification_disabled || $target_user_notification_disabled) {
            return;
        }

        $data['user_id'] = PostModel::find($post_id)->user_id;
        $data['targer_user_id'] = $user_id;
        $data['action_type'] = 'user_comment_post';
        $data['content'] = UserModel::find($user_id)->profile->display_name . ' đã bình luận bài viết của bạn';
        $data['comment_id'] = $comment_id;
        $data['post_id'] = $post_id;

        $notification = NotificationModel::create($data);

        return response()->json([
            'data' => $notification
        ], 200);
    }
}
