<?php

namespace App\Events;

use App\Http\Resources\MessageResource;
use App\Models\Message as MessageModel;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User as UserModel;
use Illuminate\Support\Facades\Log;

class UserSendMessageEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    protected $user_id;
    protected $message_id;
    protected $content;


    public function __construct($user_id, $message_id, $content)
    {
        $this->user_id = $user_id;
        $this->message_id = $message_id;
        $this->content = $content;
    }


    public function broadcastOn(): array
    {

        $conversation = MessageModel::find($this->message_id)->conversation;
        $recipient_id_array = $conversation->users->pluck('id');

        $channel_array = [];
        foreach ($recipient_id_array as $recipient_id) {
            Log::info("Array: ". $recipient_id);
            $channel_array[] = new Channel('user.' . $recipient_id);
        }

        return $channel_array;
    }

    public function broadcastWith()
    {
        $message = MessageModel::find($this->message_id);
        Log::info("broadcasted");
        return [
            "data" => new MessageResource($message),
        ];
    }
}
