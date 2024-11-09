<?php

namespace App\Http\Controllers;

use App\Events\NotificationEvent;
use App\Http\Resources\FriendRequestResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\User as UserModel;
use App\Models\FriendRequest as FriendRequestModel;
use App\Models\Relationship as RelationshipModel;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use App\Events\FriendRequestEvent;
use App\Models\Conversation as ConversationModel;
use Illuminate\Support\Facades\Log;
use App\Models\Notification as NotificationModel;

class FriendRequestController extends Controller
{
    /**
     * Danh sách lời mời kết bạn
     * @param Request $request
     * 
     * @response 200 : Danh sách lời mời kết bạn được gửi đến người dùng hiện tại
     * 
     * @return AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $friend_requests = FriendRequestModel::where('receiver_id', $request->user()->id)->where('status', 'pending')->get();
        return FriendRequestResource::collection($friend_requests);
    }


    /**
     * Chi tiết lời mời kết bạn
     * @param string $id
     * 
     * @response 200 : Chi tiết lời mời kết bạn
     * @response 404 : Lời mời kết bạn không tồn tại
     * 
     * @return FriendRequestResource
     */
    public function show(string $id)
    {
        $friend_request = FriendRequestModel::find($id);

        if (!$friend_request) {
            return response()->json([
                'message' => 'Friend request not found.',
            ], 404);
        }

        return new FriendRequestResource($friend_request);
    }


    /**
     * Gửi lời mời kết bạn
     * @param Request $request
     * 
     * @bodyParam receiver_id : ID người nhận lời mời
     * 
     * @response 200 : Lời mời kết bạn đã được gửi
     * @response 400 : Lời mời kết bạn đã được gửi trước đó (đã tồn tại và status = pending)
     * @response 404 : Người nhận không tồn tại
     * 
     * @return FriendRequestResource
     */
    public function store(Request $request)
    {
        if (!UserModel::find($request->receiver_id)) {
            return response()->json([
                'message' => 'Không tìm thấy người dùng này!',
            ]); //status: 404
        }

        if (FriendRequestModel::where('sender_id', $request->user()->id)->where('receiver_id', $request->receiver_id)->where('status', 'pending')->exists()) {
            return response()->json([
                'message' => 'Bạn đã gửi yêu cầu này rồi!',
            ]); //status: 400
        }

        if (RelationshipModel::where('user_id', $request->user()->id)->where('related_user_id', $request->receiver_id)->where('type', 'friend')->exists()) {
            return response()->json([
                'message' => 'Bạn đã là bạn với người dùng này!',
            ]); //status: 400
        }

        $friend_request = FriendRequestModel::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $request->receiver_id,
        ]);

        event(new FriendRequestEvent($request->user()->id, $request->receiver_id, 'pending'));
        $this->sendNotification($friend_request->id, 'pending');
        return new FriendRequestResource($friend_request);
    }


    /**
     * Thay đổi trạng thái của lời mời kết bạn (chấp nhận, từ chối)
     * @param Request $request
     * 
     * @bodyParam id : ID của lời mời kết bạn
     * @bodyParam status : Trạng thái mới (accepted, rejected)
     * 
     * @response 200 : Lời mời kết bạn đã được chấp nhận
     * @response 400 : Trạng thái không hợp lệ
     * @response 404 : Lời mời kết bạn không tồn tại
     * 
     * @return FriendRequestResource
     */
    public function update(Request $request, string $id)
    {
        if (!in_array($request->status, ['accepted', 'rejected'])) {
            return response()->json([
                'message' => 'Invalid status.',
            ]);
        }

        if (!FriendRequestModel::find($id)) {
            return response()->json([
                'message' => 'Friend request not found.',
            ]);
        }

        if (FriendRequestModel::find($id)->status !== 'pending') {
            return response()->json([
                'message' => 'Friend request already ' . FriendRequestModel::find($id)->status . '.',
            ]);
        }

        $friend_request = FriendRequestModel::find($id);
        $friend_request->update([
            'status' => $request->status,
        ]);

        if ($request->input('status') === 'accepted') {
            event(new FriendRequestEvent(FriendRequestModel::find($id)->sender_id, FriendRequestModel::find($id)->receiver_id, 'accepted'));
            RelationshipModel::create([
                'user_id' => FriendRequestModel::find($id)->sender_id,
                'related_user_id' => FriendRequestModel::find($id)->receiver_id,
                'type' => 'friend',
            ]);
            $user_id = $request->user()->id;
            $receiver_id = FriendRequestModel::find($id)->sender_id;

            $conversation_data = ConversationModel::whereHas('users', function($query) use ($user_id) {
                $query->where('user_id', $user_id);
            })->whereHas('users', function($query) use ($receiver_id) {
                $query->where('user_id', $receiver_id);
            })->first();

            if (!$conversation_data) {
                $conversation_data = ConversationModel::create();
                $conversation_data->users()->attach([$user_id, $receiver_id]);
            }

            $this->sendNotification($id, 'accepted');
        } else {
            event(new FriendRequestEvent(FriendRequestModel::find($id)->sender_id, FriendRequestModel::find($id)->receiver_id, 'rejected'));
        }
        Log::info(json_encode($friend_request));
        return new FriendRequestResource($friend_request);
    }

    public function cancel(Request $request, string $user_id)
    {
        $friend_request = FriendRequestModel::where('sender_id', $request->user()->id)->where('receiver_id', $user_id)->where('status', 'pending')->first();


        $friend_request->delete();

        return response()->json([
            'message' => 'Friend request canceled.',
        ]);


    }

    public function sendNotification($friend_request_id, $status)
    {
        $friend_request = FriendRequestModel::find($friend_request_id);

        $receiver = UserModel::find($friend_request->receiver_id);
        $sender = UserModel::find($friend_request->sender_id);

        switch ($status) {
            case 'pending':
                $data['user_id'] = $receiver->id;
                $data['target_user_id'] = $sender->id;
                $data['content'] = $sender->profile->display_name . ' đã gửi lời mời kết bạn';
                $data['action_type'] = 'user_send_friend_request';
                break;
            case 'accepted':
                $data['user_id'] = $sender->id;
                $data['target_user_id'] = $receiver->id;
                $data['content'] = $receiver->profile->display_name . ' đã chấp nhận lời mời kết bạn';
                $data['action_type'] = 'user_accept_friend_request';
                break;
        }
        $data['friend_request_id'] = $friend_request_id;

        $notification = NotificationModel::create($data);
        Log::info('friend request notification: '.json_encode($notification));
        event(new NotificationEvent($notification));
    }
}
