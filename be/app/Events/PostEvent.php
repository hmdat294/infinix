<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PostEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $id;
    public $content;
    public $user_id;
    public $media;


    public function __construct($id, $content, $user_id, $media)
    {
        $this->id = $id;
        $this->content = $content;
        $this->user_id = $user_id;
        $this->media = $media;
    }

    public function broadcastOn()
    {
        return new Channel('post');
    }
}
