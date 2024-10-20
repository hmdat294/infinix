<?php

namespace App\Events;

use App\Http\Resources\PostResource;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Post as PostModel;

class UserLikePostEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    protected $post_id;
    protected $user_id;

    public function __construct($post_id, $user_id)
    {
        $this->post_id = $post_id;
        $this->user_id = $user_id;
    }

    public function broadcastOn()
    {
        $post_user_id = PostModel::find($this->post_id)->user->id;
        return new Channel('user.' . $post_user_id);

    }
}
