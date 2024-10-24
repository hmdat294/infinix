<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Message as MessageModel;
use App\Http\Resources\MessageResource;

class UserRecallMessageEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    protected $user_id;
    protected $message_id;
    /**
     * Create a new event instance.
     */
    public function __construct($user_id, $message_id)
    {
        $this->user_id = $user_id;
        $this->message_id = $message_id;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {

        $conversation = MessageModel::find($this->message_id)->conversation;
        $recipient_id_array = $conversation->users->pluck('id');

        $channel_array = [];
        foreach ($recipient_id_array as $recipient_id) {
            $channel_array[] = new Channel('user.' . $recipient_id);
        }
        
        return $channel_array;
    }

    public function broadcastWith()
    {
        $message = MessageModel::find($this->message_id);
        return [
            "data" => new MessageResource($message),
        ];
    }
}
