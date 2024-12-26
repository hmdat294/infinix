<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\FriendRequest;
use App\Http\Resources\UserResource;
use App\Models\User as UserModel;

class CancelFriendRequestEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    protected $id;
    protected $sender_id;
    protected $receiver_id;

    public function __construct($id, $sender_id, $receiver_id)
    {
        $this->id = $id;
        $this->sender_id = $sender_id;
        $this->receiver_id = $receiver_id;

    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('user.' . $this->sender_id),
            new Channel('user.' . $this->receiver_id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->id,
            'sender' => new UserResource(UserModel::find($this->sender_id)),
            'receiver' => new UserResource(UserModel::find($this->receiver_id)),
        ];
    }
}
