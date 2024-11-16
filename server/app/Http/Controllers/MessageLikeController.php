<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\MessageLike;
use App\Http\Resources\MessageResource;
use App\Events\UserLikeMessageEvent;

class MessageLikeController extends Controller
{
    public function index() {

    }

    public function store(Request $request) {
        $message = Message::find($request->message_id);

        $message_like = MessageLike::where('message_id', $message->id)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($message_like) {
            $message_like->delete();
            event(new UserLikeMessageEvent($message, $request->user(), 'unlike'));
            return response()->json([
                'type' => 'unlike',
                'data' => new MessageResource(Message::find($request->message_id)),
            ]);
        } else {
            MessageLike::create([
                'message_id' => $message->id,
                'user_id' => $request->user()->id,
            ]);
            event(new UserLikeMessageEvent($message, $request->user(), 'like'));
            return response()->json([
                'type' => 'like',
                'data' => new MessageResource(Message::find($request->message_id)),
            ]);
        }
    }
}
