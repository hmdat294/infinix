<?php

namespace App\Http\Controllers;

use App\Events\ConversationInvitationEvent;
use Illuminate\Http\Request;
use App\Http\Resources\ConversationInvitationResource;
use App\Models\ConversationInvitation as ConversationInvitationModel;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use App\Models\User as UserModel;
use App\Models\Notification as NotificationModel;
use Illuminate\Support\Facades\Log;

use function Pest\Laravel\json;

class ConversationInvitationController extends Controller
{
    /**
     * Danh sách lời mời tham gia cuộc trò chuyện nhóm
     * 
     * @response 200 : Danh sách lời mời
     * 
     * @return AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $conversation_invitations = ConversationInvitationModel::where('receiver_id', $request->user()->id)->where('status', 'pending')->get();
        return ConversationInvitationResource::collection($conversation_invitations);
    }


    /**
     * Chi tiết lời mời tham gia cuộc trò chuyện nhóm
     * 
     * @response 200 : Chi tiết lời mời
     * @response 404 : Lời mời không tồn tại
     * 
     * @return ConversationInvitationResource
     */
    public function show(string $id)
    {
        $conversation_invitation = ConversationInvitationModel::find($id);

        if (!$conversation_invitation) {
            return response()->json([
                'message' => 'Conversation invitation not found.',
            ], 404);
        }

        return new ConversationInvitationResource($conversation_invitation);
    }


    /**
     * Gửi lời mời tham gia cuộc trò chuyện nhóm
     * 
     * @bodyParam receiver_id : ID người nhận lời mời
     * @bodyParam conversation_id : ID cuộc trò chuyện
     * 
     * @response 200 : Lời mời đã được gửi
     * @response 400 : Lời mời đã được gửi trước đó (đã tồn tại và status = pending)
     */
    public function store(Request $request)
    {
        if (ConversationInvitationModel::where('sender_id', $request->user()->id)
        ->where('receiver_id', $request->receiver_id)
        ->where('conversation_id', $request->conversation_id)
        ->where('status', 'pending')->exists()) {
            return response()->json([
                'message' => 'Conversation invitation has been sent before.',
            ], 400);
        }

        $conversation_invitation = ConversationInvitationModel::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $request->receiver_id,
            'conversation_id' => $request->conversation_id,
        ]);

        event(new ConversationInvitationEvent($request->user()->id, $request->receiver_id, 'pending', $request->conversation_id));

        $this->sendNotification($conversation_invitation->id, 'pending');

        return response()->json([
            'message' => 'Conversation invitation has been sent.',
        ]);
    }


    /**
     * Cập nhật lời mời tham gia cuộc trò chuyện nhóm
     * 
     * @bodyParam status : Trạng thái lời mời (accepted, rejected)
     * 
     * @response 200 : Lời mời đã được chấp nhận
     * @response 200 : Lời mời đã bị từ chối
     * @response 400 : Trạng thái không hợp lệ
     * @response 404 : Lời mời không tồn tại
     * 
     * @return JsonResponse
     */
    public function update(Request $request, string $id)
    {
        if (!in_array($request->status, ['accepted', 'rejected'])) {
            return response()->json([
                'message' => 'Invalid status.',
            ], 400);
        }

        $conversation_invitation = ConversationInvitationModel::find($id);

        if (!$conversation_invitation) {
            return response()->json([
                'message' => 'Conversation invitation not found.',
            ], 404);
        }

        $conversation_invitation->update([
            'status' => $request->status,
        ]);

        if ($request->status === 'accepted') {
            event(new ConversationInvitationEvent($conversation_invitation->sender_id, $conversation_invitation->receiver_id, 'accepted', $conversation_invitation->conversation_id));
            $conversation_invitation->conversation->users()->attach($conversation_invitation->receiver_id);
            $this->sendNotification($conversation_invitation->id, 'accepted');
        } else {
            event(new ConversationInvitationEvent($conversation_invitation->sender_id, $conversation_invitation->receiver_id, 'rejected', $conversation_invitation->conversation_id));
        }

        return response()->json([
            'message' => $conversation_invitation->status === 'accepted' ? 'Conversation invitation has been accepted.' : 'Conversation invitation has been rejected.',
        ]);
    }

    public function sendNotification($conversation_invitation_id, $status)
    {
        $conversation_invitation = ConversationInvitationModel::find($conversation_invitation_id);

        $receiver = UserModel::find($conversation_invitation->receiver_id);
        $sender = UserModel::find($conversation_invitation->sender_id);

        switch ($status) {
            case 'pending':
                $data['user_id'] = $conversation_invitation->receiver_id;
                $data['target_user_id'] = $conversation_invitation->sender_id;
                $data['content'] = $sender->profile->display_name . ' đã gửi lời mời tham gia nhóm trò chuyện';
                $data['action_type'] = 'user_send_conversation_invitation';
                break;
            case 'accepted':
                $data['user_id'] = $conversation_invitation->sender_id;
                $data['target_user_id'] = $conversation_invitation->receiver_id;
                $data['content'] =  $receiver->profile->display_name . ' đã chấp nhận lời mời tham gia nhóm trò chuyện';
                $data['action_type'] = 'user_accept_conversation_invitation';
                break;
        }
        $data['conversation_invitation_id'] = $conversation_invitation_id;

        $notification = NotificationModel::create($data);
        Log::info('conversation invitation notification: '.json_encode($notification));
        return response()->json([
            'data' => $notification
        ], 200);
    }
}
