<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DisabledNotification as DisabledNotificationModel;
use App\Models\User as UserModel;
use App\Models\Conversation as ConversationModel;

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

        $disabled_notification = DisabledNotificationModel::where('user_id', $data['user_id'])
        ->where('target_user_id', $request->target_user_id)
        ->first();

    if (!$disabled_notification) {
        $data['target_user_id'] = $request->target_user_id;
        $data['type'] = 'user';
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
        }
    }

        // else if ($request->input('type') == 'group_message') {
        //     $disabled_notification = DisabledNotificationModel::where('user_id', $data['user_id'])
        //         ->where('conversation_id', $request->conversation_id)
        //         ->first();

        //     if (!$disabled_notification) {
        //         $data['conversation_id'] = $request->conversation_id;
        //         $data['message_id'] = $request->message_id;
        //         $data['type'] = 'group_message';
        //         $conversation = ConversationModel::find($request->conversation_id);
        //         $data['content'] = 'Tin nhắn mời từ ' . $conversation->name;
        //         $data['action_type'] = 'user_send_group_message';
        //     }
        // }

        // else if ($request->input('type') == 'user_message') {
        //     $disabled_notification = DisabledNotificationModel::where('user_id', $data['user_id'])
        //         ->where('message_id', $request->message_id)
        //         ->first();

        //     if (!$disabled_notification) {
        //         $data['message_id'] = $request->message_id;
        //         $target_user_display_name = UserModel::find($request->target_user_id)->display_name;
        //         $data['type'] = 'user_message';
        //         $data['content'] =  $target_user_display_name. ' Đã gửi cho bạn một tin nhắn';
        //         $data['action_type'] = 'user_send_message';
        //     }
        // }

        // else if ($request->input('type') == 'post') {
        //     $disabled_notification = DisabledNotificationModel::where('user_id', $data['user_id'])
        //         ->where('post_id', $request->post_id)
        //         ->first();

        //     if (!$disabled_notification) {
        //         $data['post_id'] = $request->post_id;
                
        //         $data['type'] = 'post';
        //         $data['content'] = 'Bài viết mới';
        //         $data['action_type'] = 'user_create_post';
        //     }
        // }
    }

    public function show(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}
