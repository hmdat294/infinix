<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Http\Resources\chatResource;
use App\Http\Resources\messageResource;
use App\Models\ConversationModel;
use App\Models\messages;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class Chat extends Controller
{

    public function list()
    {
        $users = User::all()->except(Auth::id());
        $users = User::leftJoin('friend_requests', 'friend_requests.receiver_id', '=', 'users.id')
            ->where('users.id', '!=', Auth::id())
            ->where(function ($query) {
                $query->whereNull('friend_requests.sender_id')
                    ->orWhere('friend_requests.sender_id', Auth::id());
            })
            ->select('users.*', 'friend_requests.sender_id', 'friend_requests.receiver_id', 'friend_requests.status')
            ->get();

        return response()->json($users);
    }

    public function user($id)
    {
        // $data['users'] = User::all()->except(Auth::id());
        $receive_user = User::find($id);

        $conversation = ConversationModel::ConversationByUserId(Auth::id(), $id)->first();

        if ($conversation == null) {
            $conversation = ConversationModel::find(ConversationModel::createConversation([Auth::id(), $id]));
        }
        $data['messages'] = messageResource::collection(messages::MessageByConversationId($conversation->id)->get());
        $data['receive_user_id'] = $receive_user->id;
        $data['receive_user_name'] = $receive_user->name;
        $data['conversation_id'] = $conversation->id;

        return response()->json($data);
    }

    public function send(Request $request)
    {
        $message_data = $request->only(['conversation_id', 'message', 'reply_id']);
        $imagePaths = [];

        if ($request->hasFile('images')) {
            $files = $request->file('images');

            foreach ($files as $file) {
                // Lưu từng tệp vào thư mục 'uploads' trong storage
                $filePath = asset('storage/' . $file->store('uploads', 'public'));
                $imagePaths[] = $filePath; // Lưu đường dẫn vào mảng
            }
        }

        $message_data['images'] = !empty($imagePaths) ? json_encode($imagePaths) : null;

        $message_data['user_id'] = Auth::id();
        $message_data['recalls'] = 0;
        $message = messages::create($message_data);

        event(new MessageSent(
            $message->id,
            $message->message,
            $message->conversation_id,
            Auth::id(),
            (!empty($imagePaths)) ? $imagePaths : null,
            $message->reply_id,
            $message->recalls,
            $message->created_at->format('d/m/Y'),
            $message->created_at->format('H:i')
        ));

        return response()->json(['status' => 'Message sent!']);
    }

    public function recall($id)
    {
        $message = messages::find($id);

        $message->recalls = 1;
        $message->save();

        event(new MessageSent(
            $message->id,
            $message->message,
            $message->conversation_id,
            Auth::id(),
            $message->image,
            $message->reply_id,
            $message->recalls,
            $message->created_at->format('d/m/Y'),
            $message->created_at->format('H:i')
        ));

        return response()->json(['status' => 'Message recalled']);
    }
}
