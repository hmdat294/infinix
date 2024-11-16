<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Http\Resources\MessageResource;

class UserLikeMessageEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    protected $message;
    protected $user;
    protected $type;

    public function __construct($message, $user, $type)
    {
        $this->message = $message;
        $this->user = $user;
        $this->type = $type;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $conversation = $this->message->conversation;
        $users = $conversation->users;
        $channels = [];

        foreach ($users as $user) {
            $channels[] = new Channel('user.' . $user->id);
        }

        return $channels;
    }

    public function broadcastWith(): array
    {
        return [
            'message' => new MessageResource($this->message),
            'type' => $this->type,
        ];
    }
}
