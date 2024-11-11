<?php

namespace App\Http\Controllers;

use App\Events\UserPinMessageEvent;
use App\Http\Resources\MessageResource;
use Illuminate\Http\Request;
use App\Models\Message as MessageModel;
use App\Models\PinnedMessage as PinnedMessageModel;

class PinMessageController extends Controller
{
    public function store(Request $request, string $id)
    {
        $user = $request->user();
        $message = MessageModel::findOrFail($id);
        $conversation = $message->conversation;

        $pinnedMessage = PinnedMessageModel::where('user_id', $user->id)
            ->where('message_id', $message->id)
            ->where('conversation_id', $conversation->id)
            ->first();

        if ($pinnedMessage) {
            $pinnedMessage->delete();

            event(new UserPinMessageEvent($message, 'unpin'));

            return response()->json([
                'message' => 'Unpinned',
            ]);
        } else {
            PinnedMessageModel::create([
                'user_id' => $user->id,
                'message_id' => $message->id,
                'conversation_id' => $conversation->id,
            ]);

            event(new UserPinMessageEvent($message, 'pin'));

            return response()->json([
                'message' => 'Pinned',
                'data' => new MessageResource($message)
            ]);
        }
    }
}
