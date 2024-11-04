<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Models\Post as PostModel;
use App\Models\PostLike as PostLikeModel;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;
use App\Events\UserLikePostEvent;
use Illuminate\Support\Facades\Log;
use App\Models\Notification as NotificationModel;
use App\Models\User as UserModel;
use App\Models\DisabledNotification as DisabledNotificationModel;

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

            event(new UserLikePostEvent($request->post_id, $request->user()->id, "unlike"));
            
            return response()->json([
                'message' => 'Đã hủy thích bài viết',
                'liked' => false
            ], 200);

        } else {

            PostLikeModel::create([
                'post_id' => $request->post_id,
                'user_id' => $request->user()->id,
            ]);
            $post = PostModel::find($request->post_id);
            event(new UserLikePostEvent($request->post_id, $request->user()->id, "like"));

            $this->sendNotification($post->user_id, $request->post_id);

            return response()->json([
                'message' => 'Đã thích bài viết',
                'liked' => true
            ], 200);
        }
    }

    public function sendNotification($user_id, $post_id)
    {
        $post = PostModel::find($post_id);
        
        $post_notification_disabled = DisabledNotificationModel::where('user_id', $post->user_id)->where('post_id', $post_id)->exists();

        $target_user_notification_disabled = DisabledNotificationModel::where('user_id', PostModel::find($post_id)->user_id)->where('target_user_id', $user_id)->exists();

        if($post_notification_disabled || $target_user_notification_disabled) {
            return;
        }

        $data = [
            'user_id' => $post->user_id,
            'target_user_id' => $user_id,
            'action_type' => 'user_like_post',
            'content' => UserModel::find($user_id)->profile->display_name . ' đã thích bài viết của bạn',
            'post_id' => $post_id,
        ];

        $notification = NotificationModel::create($data);

        return $notification;
    }
}