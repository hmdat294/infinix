<?php

namespace App\Http\Controllers;

use App\Http\Resources\NotificationResource;
use Illuminate\Http\Request;
use App\Models\DisabledNotification as DisabledNotificationModel;
use App\Models\User as UserModel;
use App\Models\Conversation as ConversationModel;
use App\Models\Notification as NotificationModel;
use Illuminate\Support\Facades\Log;

use function PHPUnit\Framework\isEmpty;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $notifications = $user->notifications()->orderBy('created_at', 'desc')->get();

        return NotificationResource::collection($notifications);
    }


    // public function store(Request $request)
    // {
    //     $user_id = $request->has('user_id') ? $request->input('user_id') : $request->user()->id;
    //     $target_user_id = $request->input('target_user_id');

    //     $data['user_id'] = $user_id;
    //     $data['target_user_id'] = $target_user_id;

    //     $disabled_notification_target_user = DisabledNotificationModel::where('user_id', $user_id)->where('target_user_id', $target_user_id)->exists();

    //     if(!$disabled_notification_target_user) {

    //         $targer_user_display_name = UserModel::find($target_user_id)->profile->display_name;

    //         if ($request->input('action_type') == 'user_follow' ) {
    //             $data['action_type'] = 'user_follow';
    //             $data['content'] = $targer_user_display_name . ' đã theo dõi bạn';
    //         }

    //         if ($request->has('friend_request_id')) {
    //             if ($request->input('action_type') == 'user_send_friend_request' ) {
    //                 $data['action_type'] = 'user_send_friend_request';
    //                 $data['content'] = $targer_user_display_name . ' đã gửi lời mời kết bạn';
    //                 $data['friend_request_id'] = $request->input('friend_request_id');
    //             }
    
    //             if ($request->input('action_type') == 'user_accept_friend_request' ) {
    //                 $data['action_type'] = 'user_accept_friend_request';
    //                 $data['content'] = $targer_user_display_name . ' đã chấp nhận lời mời kết bạn';
    //                 $data['friend_request_id'] = $request->input('friend_request_id');
    //             }
    //         }

    //         if ($request->has('conversation_invitation_id')) {
    //             if ($request->input('action_type') == 'user_send_conversation_invitation' ) {
    //                 $data['action_type'] = 'user_send_conversation_invitation';
    //                 $data['content'] = $targer_user_display_name . ' đã gửi lời mời tham gia nhóm trò chuyện';
    //                 $data['conversation_invitation_id'] = $request->input('conversation_invitation_id');
    //             }
    
    //             if ($request->input('action_type') == 'user_accept_conversation_invitation' ) {
    //                 $data['action_type'] = 'user_accept_conversation_invitation';
    //                 $data['content'] = $targer_user_display_name . ' đã chấp nhận lời mời tham gia nhóm trò chuyện';
    //                 $data['conversation_invitation_id'] = $request->input('conversation_invitation_id');
    //             }
    //         }

    //         if ($request->has('post_id')) {

    //             $disabled_notification_post = DisabledNotificationModel::where('user_id', $user_id)->where('post_id', $request->input('post_id'))->exists();

    //             if(!$disabled_notification_post) {
    //                 if ($request->input('action_type') == 'user_create_post' ) {
    //                     $data['action_type'] = 'user_create_post';
    //                     $data['content'] = $targer_user_display_name . ' đã đăng một bài viết mới';
    //                     $data['post_id'] = $request->input('post_id');
    //                 }
    
    //                 if ($request->input('action_type') == 'user_like_post' ) {
    //                     $data['action_type'] = 'user_like_post';
    //                     $data['content'] = $targer_user_display_name . ' đã thích bài viết của bạn';
    //                     $data['post_id'] = $request->input('post_id');
    //                 }
    
    //                 if ($request->input('action_type') == 'user_comment_post' ) {
    //                     $data['action_type'] = 'user_comment_post';
    //                     $data['content'] = $targer_user_display_name . ' đã bình luận bài viết của bạn';
    //                     $data['comment_id'] = $request->input('comment_id');
    //                     $data['post_id'] = $request->input('post_id');
    //                 }
    
    //                 if ($request->input('action_type') == 'user_share_post' ) {
    //                     $data['action_type'] = 'user_share_post';
    //                     $data['content'] = $targer_user_display_name . ' đã chia sẻ bài viết của bạn';
    //                     $data['post_id'] = $request->input('post_id');
    //                 }
    //             }

    //         }

    //         if ($request->has('conversation_id') && $request->has('message_id')) {

    //             $disabled_notification_conversation = DisabledNotificationModel::where('user_id', $user_id)->where('conversation_id', $request->input('conversation_id'))->exists();

    //             if(!$disabled_notification_conversation) {
    //                 if ($request->input('action_type') == 'user_send_message' ) {
    //                     $data['action_type'] = 'user_send_message';
    //                     $data['content'] = $targer_user_display_name . ' đã gửi một tin nhắn';
    //                     $data['conversation_id'] = $request->input('conversation_id');
    //                     $data['message_id'] = $request->input('message_id');
    //                 }

    //                 if ($request->input('action_type') == 'user_send_group_message' ) {

    //                     $conversation_name = ConversationModel::find($request->input('conversation_id'))->name;

    //                     $data['action_type'] = 'user_send_group_message';
    //                     $data['content'] = $targer_user_display_name . ' đã gửi một tin nhắn trong nhóm ' . $conversation_name;
    //                     $data['conversation_id'] = $request->input('conversation_id');
    //                     $data['message_id'] = $request->input('message_id');
    //                 }
    //             }
    //         }

    //         $notification = NotificationModel::create($data);

    //         return response()->json([
    //             'data' => $notification
    //         ], 200);

    //     }
        
    // }

    public function show(string $id)
    {
        $notification = DisabledNotificationModel::find($id);
        return new NotificationResource($notification);
    }

    public function update(Request $request, string $id)
    {
        if ($request->has('is_read')) {
            $notification = DisabledNotificationModel::find($id);
            $notification->is_read = true;
            $notification->save();
        }

        return new NotificationResource(NotificationModel::find($id));
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
