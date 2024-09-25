<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class MessageSent implements ShouldBroadcast 
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $id;
    public $message;
    public $conversation_id;
    public $user_id;
    public $image;
    public $reply_id;
    public $recalls;
    public $date;
    public $time;

    public function __construct($id, $message, $conversation_id, $user_id, $image, $reply_id, $recalls, $date, $time)
    {
        $this->id = $id;
        $this->message = $message;
        $this->conversation_id = $conversation_id;
        $this->user_id = $user_id;
        $this->image = $image;
        $this->reply_id = $reply_id;
        $this->recalls = $recalls;
        $this->date = $date;
        $this->time = $time;
    }

    public function broadcastOn()
    {
        return new Channel('chat-' . $this->conversation_id);
    }
}
