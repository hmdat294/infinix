<?php

namespace App\Events;

use App\Http\Resources\NotificationResource;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class NotificationEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    protected $notification;
    public function __construct($notification)
    {
        $this->notification = $notification;
    }

    
    public function broadcastOn(): array
    {
        return [
            new Channel('user.' . $this->notification->user_id),
        ];
    }

    public function broadcastWith(): array
    {
        Log::info('NotificationEvent: ' . $this->notification);

        return [
            'data' => new NotificationResource($this->notification)
        ];
    }
}
