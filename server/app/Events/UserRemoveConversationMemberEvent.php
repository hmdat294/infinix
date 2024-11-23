<?php

namespace App\Events;

use App\Http\Resources\UserResource;
use App\Models\Conversation;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

use App\Models\User;

class UserRemoveConversationMemberEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    protected $conversation_id;
    protected $remover_id;
    protected $removed_id;
    public function __construct($conversation_id, $remover_id, $removed_id)
    {
        $this->conversation_id = $conversation_id;
        $this->remover_id = $remover_id;
        $this->removed_id = $removed_id;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {

        $conversation = Conversation::find($this->conversation_id);
        $recipient_id_array = $conversation->users->pluck('id');

        $channel_array = [];
        foreach ($recipient_id_array as $recipient_id) {
            $channel_array[] = new Channel('user.' . $recipient_id);
        }

        return $channel_array;
    }

    public function broadcastWith()
    {
        return [
            "data" => [
                "conversation_id" => $this->conversation_id,
                "remover" => new UserResource(User::find($this->remover_id)),
                "removed" => new UserResource(User::find($this->removed_id)),
            ],
        ];
    }
}
