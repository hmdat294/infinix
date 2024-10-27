<?php

namespace App\Http\Controllers;

use App\Http\Resources\FriendRequestResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\User as UserModel;
use App\Models\FriendRequest as FriendRequestModel;
use App\Models\Relationship as RelationshipModel;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use App\Events\FriendRequestEvent;

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
            ], 400);
        }

        if (!FriendRequestModel::find($id)) {
            return response()->json([
                'message' => 'Friend request not found.',
            ], 404);
        }

        if (FriendRequestModel::find($id)->status !== 'pending') {
            return response()->json([
                'message' => 'Friend request already ' . FriendRequestModel::find($id)->status . '.',
            ], 400);
        }

        $friend_request = FriendRequestModel::find($id)->update([
            'status' => $request->status,
        ]);

        if ($request->status === 'accepted') {
            event(new FriendRequestEvent(FriendRequestModel::find($id)->sender_id, FriendRequestModel::find($id)->receiver_id, 'accepted'));
            RelationshipModel::create([
                'user_id' => FriendRequestModel::find($id)->sender_id,
                'related_user_id' => FriendRequestModel::find($id)->receiver_id,
                'type' => 'friend',
            ]);
        } else {
            event(new FriendRequestEvent(FriendRequestModel::find($id)->sender_id, FriendRequestModel::find($id)->receiver_id, 'rejected'));
        }

        return new FriendRequestResource($friend_request);
    }

    public function cancel(Request $request, string $user_id)
    {
        $friend_request = FriendRequestModel::where('sender_id', $request->user()->id)->where('receiver_id', $user_id)->where('status', 'pending')->first();

        if (!$friend_request) {
            return response()->json([
                'message' => 'Friend request not found.',
            ], 404);
        }

        $friend_request->delete();

        return response()->json([
            'message' => 'Friend request canceled.',
        ]);
    }
}
