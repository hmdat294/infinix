<?php

namespace App\Http\Controllers;

use App\Events\Relationship as EventsRelationship;
use App\Models\ConversationModel;
use App\Models\friendrequest;
use App\Models\relationship as ModelsRelationship;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class Relationship extends Controller
{
    public function get_friend()
    {
        $conversation_id = DB::table('conversation_user')
            ->where('user_id', '=', Auth::id())
            ->select('conversation_id')
            ->get();

        $other_users = [];
        foreach ($conversation_id as $conversation) {

            $otherUsers = User::join('conversation_user', 'conversation_user.user_id', '=', 'users.id')
                ->join('conversations', 'conversation_user.conversation_id', '=', 'conversations.id')
                ->where('conversation_user.conversation_id', '=', $conversation->conversation_id)
                ->where('users.id', '!=', Auth::id())
                ->select('users.*', 'conversations.name as conversation_name', 'conversations.is_group', 'conversation_user.conversation_id')
                ->get();

            if (count($otherUsers) > 0) {
                $other_users = array_merge($other_users, $otherUsers->toArray());
            }
        }

        return response()->json($other_users);
    }

    public function get_requestfriend()
    {

        $sender_id = friendrequest::where('receiver_id', '=', Auth::id())
            ->select('sender_id')
            ->get();

        $friend_request = [];
        foreach ($sender_id as $sender) {

            $users = User::leftJoin('friend_requests', 'friend_requests.sender_id', '=', 'users.id')
                ->where('friend_requests.sender_id', '=', $sender->sender_id)
                ->where('friend_requests.status', '=', 'Đã gửi')
                ->select('users.*', 'friend_requests.id as friend_request_id', 'friend_requests.sender_id', 'friend_requests.receiver_id', 'friend_requests.status')
                ->get();

            if (count($users) > 0) {
                $friend_request = array_merge($friend_request, $users->toArray());
            }
        }

        return response()->json($friend_request);
    }

    public function addfriend(Request $request)
    {

        $receiver_id = $request->receiver_id;
        $sender_id = Auth::id();

        $existingRequest = friendrequest::where('sender_id', $sender_id)
            ->where('receiver_id', $receiver_id)
            ->where('status', 'Đã gửi')
            ->first();

        if ($existingRequest) {
            return response()->json(['error' => 'Yêu cầu kết bạn đã được gửi']);
        }

        $friendRequest = FriendRequest::create([
            'sender_id' => $sender_id,
            'receiver_id' => $receiver_id,
            'status' => 'Đã gửi'
        ]);

        event(new EventsRelationship($friendRequest, $friendRequest->receiver_id));

        return response()->json(['status' => 'Add friend success!', $friendRequest]);
    }

    public function acceptfriend($id)
    {
        $req = friendrequest::find($id);

        $req->status = 'Đã chấp nhận';
        $req->save();

        ModelsRelationship::create([
            'user_id' => Auth::id(),
            'related_user_id' => $req->sender_id,
            'relationship_type' => 'Bạn bè'
        ]);

        ConversationModel::find(ConversationModel::createConversation([Auth::id(),  $req->sender_id]));

        return response()->json(['status' => 'Accept Friend', $req]);
    }

    public function refusefriend($id)
    {
        $req = friendrequest::find($id);

        $req->status = 'Đã từ chối';
        $req->save();

        return response()->json(['status' => 'Refuse Friend']);
    }
}
