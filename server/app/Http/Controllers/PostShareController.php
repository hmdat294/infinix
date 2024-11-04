<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post as PostModel;
use App\Models\PostShare as PostShareModel;
use App\Http\Resources\UserResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\JsonResponse;
use App\Events\UserSharePostEvent;
use App\Models\Notification as NotificationModel;
use App\Models\User as UserModel;
use App\Models\DisabledNotification as DisabledNotificationModel;

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
    public function index(Request $request, string $post_id)
    {
        $post = PostModel::find($post_id);
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
    public function store(Request $request, string $post_id)
    {
        $post_share = PostShareModel::where('post_id', $post_id)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($post_share) {
            $post_share->delete();

            event(new UserSharePostEvent($post_id, $request->user()->id, "unshare"));

            return response()->json([
                'message' => 'Đã hủy chia sẻ bài viết',
            ], 200);
        } else {
            PostShareModel::create([
                'post_id' => $post_id,
                'user_id' => $request->user()->id,
            ]);
            $post = PostModel::find($request->post_id);

            event(new UserSharePostEvent($post->user_id, $request->user()->id, "share"));

            $this->sendNotification($request->user()->id, $post_id);

            return response()->json([
                'message' => 'Chia sẻ thành công',
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
            'user_id' => PostModel::find($post_id)->user_id,
            'target_user_id' => $user_id,
            'action_type' => 'user_share_post',
            'content' => UserModel::find($user_id)->profile->display_name . ' đã chia sẻ bài viết của bạn',
            'post_id' => $post_id,
        ];

        $notification = NotificationModel::create($data);

        return response()->json([
            'data' => $notification
        ], 200);
    }
}
