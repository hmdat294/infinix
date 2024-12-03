<?php

namespace App\Events;

use App\Http\Resources\UserResource;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserFollowUserEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    protected $follower_id;
    protected $followed_id;
    protected $type;

    public function __construct($follower_id, $followed_id, $type)
    {
        $this->follower_id = $follower_id;
        $this->followed_id = $followed_id;
        $this->type = $type;
    }
    public function broadcastOn(): array
    {
        return [
            new Channel('user.' . $this->followed_id),
            new Channel(''. $this->followed_id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'follower' => new UserResource($this->follower_id),
            'followed' => new UserResource($this->followed_id),
            'type' => $this->type,
        ];
    }
}
