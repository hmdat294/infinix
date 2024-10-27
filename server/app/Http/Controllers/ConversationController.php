<?php

namespace App\Http\Controllers;

use App\Http\Resources\ConversationResource;
use Illuminate\Http\Request;
use App\Models\Conversation as ConversationModel;
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
        $conversations = $request->user()->conversations;

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
}
