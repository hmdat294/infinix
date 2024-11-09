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

class UserBlockUserEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    protected $blocker;
    protected $blocked;
    protected $type = 'block';


    public function __construct($blocker, $blocked, $type)
    {
        $this->blocker = $blocker;
        $this->blocked = $blocked;
        $this->type = $type;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.' . $this->blocked->id),
            new PrivateChannel('user.' . $this->blocker->id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'blocker' => new UserResource($this->blocker),
            'blocked' => new UserResource($this->blocked),
            'type' => $this->type,
        ];
    }
}
