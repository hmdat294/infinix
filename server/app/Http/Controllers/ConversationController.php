<?php

namespace App\Http\Controllers;

use App\Http\Resources\ConversationResource;
use Illuminate\Http\Request;
use App\Models\Conversation as ConversationModel;

class ConversationController extends Controller
{
    
    public function index(Request $request)
    {
        $conversations = $request->user()->conversations;

        return ConversationResource::collection($conversations);
    }

    public function store(Request $request, string $id)
    {
        $user_id = $request->user()->id;
        $receiver_id = $id;

        $conversation_data = ConversationModel::create();
        $conversation_data->users()->attach([$user_id, $receiver_id]);

        return new ConversationResource($conversation_data);
    }


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

    }
}
