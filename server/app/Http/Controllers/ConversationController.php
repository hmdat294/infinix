<?php

namespace App\Http\Controllers;

use App\Http\Resources\ConversationResource;
use App\Http\Resources\MessageMediaResource;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Models\Conversation as ConversationModel;
use App\Models\User;
use App\Events\UserRemoveConversationMemberEvent;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ConversationController extends Controller
{
    
    /**
     * Danh sách cuộc trò chuyện của người dùng
     * 
     * @param Request $request
     * 
     * @return AnonymousResourceCollection;
     */
    public function index(Request $request)
    {
        $conversations = $request->user()->conversations->sortByDesc('created_at');
        return ConversationResource::collection($conversations);
    }

    /**
     * Tạo cuộc trò chuyện với một người dùng
     * 
     * @param Request $request
     * @param string $id : Id của người nhận tin nhắn
     * 
     * @return ConversationResource
     */
    public function store(Request $request, string $id)
    {
        $user_id = $request->user()->id;
        $receiver_id = $id;

        $conversation_data = ConversationModel::create();
        $conversation_data->users()->attach([$user_id, $receiver_id]);

        return new ConversationResource($conversation_data);
    }

    /**
     * Xem thông tin cuộc trò chuyện với một người dùng, nếu không có thì tạo mới
     * 
     * @param Request $request
     * @param string $id : Id của người nhận tin nhắn
     * 
     * @return ConversationResource
     */
    public function show(Request $request, string $id)
    {
        $user_id = $request->user()->id;
        $receiver_id = $id;
        
        $conversation_data = ConversationModel::whereHas('users', function($query) use ($user_id) {
            $query->where('user_id', $user_id);
        })->whereHas('users', function($query) use ($receiver_id) {
            $query->where('user_id', $receiver_id);
        })->first();

        if ($conversation_data) {
            return new ConversationResource($conversation_data);
        } else {
            return $this->store($request, $id);
        }
    }


    public function update(Request $request, string $id)
    {

    }

    public function destroy(string $id)
    {
        //  delete conversation
        ConversationModel::destroy($id);
    }

    public function medias(string $id)
    {
        $conversation = ConversationModel::find($id);
        $medias = $conversation->messages->map(function ($messages) {
            return $messages->medias;
        })->flatten();

        return MessageMediaResource::collection($medias);
    }

    public function removeMember(Request $request)
    {
        $id = $request->input('conversation_id');
        $member_id = $request->input('user_id');
        $user_id = $request->user()->id;

        $conversation = ConversationModel::find($id);
        $conversation->users()->detach($member_id);

        event(new UserRemoveConversationMemberEvent($id, $user_id, $member_id));

        return new UserResource(User::find($member_id));
    }
}
