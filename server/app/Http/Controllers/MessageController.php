<?php

namespace App\Http\Controllers;

use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use Illuminate\Http\Request;
use App\Models\Conversation as ConversationModel;
use App\Models\Message as MessageModel;

class MessageController extends Controller
{

    
    public function store(Request $request)
    {
        $conversation = ConversationModel::find($request->conversation_id);

        $message_data = $request->only(['reply_to_message_id', 'content']);
        $message_data['user_id'] = $request->user()->id;

        $message = $conversation->messages()->create($message_data);

        if ($request->hasFile('medias')) {
            $medias = $request->file('medias');
            foreach ($medias as $media) {
                $message->medias()->create([
                    'message_id' => $message->id,
                    'type' => $media->getMimeType(),
                    'path' => asset('storage/' . $media->store('uploads', 'public'))
                ]);
            }
        }

        return new MessageResource($message);
    }
    

    public function show(string $id)
    {
        $message = MessageModel::find($id);

        return new MessageResource($message);
    }


    
    public function update(Request $request, string $id)
    {
        $message = MessageModel::find($id);

        $message->update($request->only('content'));
        if ($request->is_recalled) {
            $message->update(['is_recalled' => true]);
        }
        $message->is_edited = true;

        if($message->is_recalled) {
            $message->medias()->delete();
        }


        return new MessageResource($message);
    }
}
