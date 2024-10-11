<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserConnectionEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    protected $user;
    protected $status;
    
    public function __construct($user, $status)
    {
        $this->user = $user;
        $this->status = $status;
    }

    
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('connection.' . $this->user->id),
        ];
    }
}
