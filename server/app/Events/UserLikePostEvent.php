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

    public function __construct($user_id, $post_id)
    {
        $this->post_id = $post_id;
        $this->user_id = $user_id;
    }

    public function broadcastOn()
    {
        $user_like_id = $this->user_id;
        $user_post_id = PostModel::find($this->post_id)->user->id;

        return [
            new Channel('user.'.$user_like_id),
            new Channel('user.'.$user_post_id),
        ];

    }

    public function broadcastWith()
    {
        $post = PostModel::find($this->post_id);
        return [
            "user_like_id" => $this->user_id,
            "data" => new PostResource($post),
        ];
    }
}
