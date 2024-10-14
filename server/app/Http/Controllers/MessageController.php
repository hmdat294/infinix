<?php

namespace App\Http\Controllers;

use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use Illuminate\Http\Request;
use App\Models\Conversation as ConversationModel;
use App\Models\Message as MessageModel;

class MessageController extends Controller
{

    /**
     * Tạo tin nhắn trong hội thoại
     * 
     * @param Request $request
     * 
     * @bodyParam conversation_id : Id của cuộc trò chuyện
     * @bodyParam reply_to_message_id : Id của tin nhắn mà tin nhắn này trả lời
     * @bodyParam content : Nội dung tin nhắn
     * @bodyParam medias : các phương tiện đi kèm
     * 
     * @return MessageResource
     */
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
    

    /**
     * Xem thông tin tin nhắn
     * 
     * @param string $id
     * 
     * @return MessageResource
     */
    public function show(string $id)
    {
        $message = MessageModel::find($id);

        return new MessageResource($message);
    }


    /**
     * Cập nhật tin nhắn
     * 
     * @param Request $request
     * @param string $id
     * 
     * @bodyParam content : Nội dung tin nhắn
     * @bodyParam is_recalled : Tin nhắn đã bị thu hồi hay chưa
     * 
     * @return MessageResource
     */
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
