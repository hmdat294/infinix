<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Relationship
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $data;
    public $receiver_id;

    public function __construct($data, $receiver_id)
    {
        $this->data = $data;
        $this->receiver_id = $receiver_id;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('relationship-' . $this->receiver_id),
        ];
    }
}
