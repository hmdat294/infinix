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

    protected $friend_request;
    public function __construct($friend_request)
    {
        $this->friend_request = $friend_request;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $friend_request = $this->friend_request;
        return [
            new PrivateChannel('user.' . $friend_request->sender_id),
            new PrivateChannel('user.' . $friend_request->receiver_id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->friend_request->id,
            'sender' => new UserResource(UserModel::find($this->friend_request->sender_id)),
            'receiver' => new UserResource(UserModel::find($this->friend_request->receiver_id)),
            'status' => $this->friend_request->status,
        ];
    }
}
