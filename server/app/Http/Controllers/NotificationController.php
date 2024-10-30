<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DisabledNotification as DisabledNotificationModel;
use App\Models\User as UserModel;
use App\Models\Conversation as ConversationModel;

use function PHPUnit\Framework\isEmpty;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $notifications = $user->notifications();

        return response()->json([
            'data' => $notifications
        ], 200);
    }


    public function store(Request $request)
    {
        $data['user_id'] = $request->user()->id;

        $disabled_notification_user = DisabledNotificationModel::where('user_id', $data['user_id'])
        ->where('target_user_id', $request->target_user_id)
        ->first();

        $notification = null;

        if (!$disabled_notification_user) {
            $target_user_display_name = UserModel::find($request->target_user_id)->display_name;

            switch ($request->input('action_type')) {
                case "user_follow":
                    $data['action_type'] = 'user_follow';
                    $data['content'] = $target_user_display_name . ' đã theo dõi bạn';
                    break;
                case "user_send_friend_request":
                    $data['action_type'] = 'user_send_friend_request';
                    $data['friend_request_id'] = $request->input('friend_request_id');
                    $data['content'] = $target_user_display_name . ' đã gửi lời mời kết bạn';
                    break;
                case "user_accept_friend_request":
                    $data['action_type'] = 'user_accept_friend_request';
                    $data['friend_request_id'] = $request->input('friend_request_id');
                    $data['content'] = $target_user_display_name . ' đã chấp nhận lời mời kết bạn';
                    break;
                case "user_send_conversation_invitation":
                    $data['action_type'] = 'user_send_conversation_invitation';
                    $data['conversation_id'] = $request->input('conversation_invitation_id');
                    $conversation = ConversationModel::find($request->input('conversation_invitation_id'));
                    $data['content'] = $target_user_display_name . ' đã gửi lời mời tham gia nhóm ' . $conversation->name;
                    break;
                case "user_accept_conversation_invitation":
                    $data['action_type'] = 'user_accept_conversation_invitation';
                    $data['conversation_id'] = $request->input('conversation_invitation_id');
                    $conversation = ConversationModel::find($request->input('conversation_invitation_id'));
                    $data['content'] = $target_user_display_name . ' đã chấp nhận lời mời tham gia nhóm ' . $conversation->name;
                    break;
                case "user_create_post":
                    $data['action_type'] = 'user_create_post';
                    $data['post_id'] = $request->input('post_id');
                    $data['content'] = $target_user_display_name . ' đã tạo một bài viết mới';
                    break;
            }

            if ($request->has('post_id')) {
                $data['post_id'] = $request->post_id;

                $disabled_notification_post = DisabledNotificationModel::where('user_id', $data['user_id'])
                    ->where('post_id', $request->post_id)
                    ->first();
                
                if (!$disabled_notification_post) {
                    switch ($request->input('action_type')) {
                        case "user_like_post":
                            $data['action_type'] = 'user_like_post';
                            $data['content'] = $target_user_display_name . ' đã thích bài viết của bạn';
                            break;
                        case "user_comment_post":
                            $data['action_type'] = 'user_comment_post';
                            $data['content'] = $target_user_display_name . ' đã bình luận bài viết của bạn';
                            break;
                        case "user_share_post":
                            $data['action_type'] = 'user_share_post';
                            $data['content'] = $target_user_display_name . ' đã chia sẻ bài viết của bạn';
                            break;
                    }
                }
                
            }

            if (!isEmpty($data)) {
                $notification = DisabledNotificationModel::create($data);
            }
        }

        return response()->json([
            'data' => $notification
        ], 200);
    }

    public function show(string $id)
    {
        $notification = DisabledNotificationModel::find($id);
        return response()->json([
            'data' => $notification
        ], 200);
    }

    public function update(Request $request, string $id)
    {
        if ($request->has('is_read')) {
            $notification = DisabledNotificationModel::find($id);
            $notification->is_read = $request->is_read;
            $notification->save();
        }

        return response()->json([
            'data' => $notification
        ], 200);
    }

    public function destroy(string $id)
    {
        $notification = DisabledNotificationModel::find($id);
        $notification->delete();

        return response()->json([
            'data' => $notification
        ], 200);
    }
}
