<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Broadcast;
use App\Models\Post as PostModel;
use App\Models\User as UserModel;
use App\Http\Resources\PostResource;
use App\Http\Resources\UserResource;

class UserSharePostEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    protected $post_id;
    protected $user_id;
    protected $type;

    public function __construct($post_id, $user_id, $type)
    {       
        $this->post_id = $post_id;
        $this->user_id = $user_id;
        $this->type = $type;
    }
    public function broadcastOn(): array
    {

        $recipient_id_array = UserModel::find($this->user_id)->friendsOf->concat(UserModel::find($this->user_id)->friendsOfMine)->pluck('id');
        $recipient_id_array[] = $this->user_id;

        $recipient_id_array = $recipient_id_array->concat(UserModel::find($this->user_id)->followers->pluck('id'));

        // $recipient_id_array[] = PostModel::find($this->post_id)->user->id;
        if (PostModel::find($this->post_id)->user->id != $this->user_id) {
            $recipient_id_array[] = PostModel::find($this->post_id)->user->id;
        }
        
        $channel_array = [];
        foreach ($recipient_id_array as $recipient_id) {
            $channel_array[] = new Channel('user.' . $recipient_id);
        }

        return $channel_array;
    }

    public function broadcastWith()
    {
        $post = PostModel::find($this->post_id);
        return [
            "user_share" => new UserResource(UserModel::find($this->user_id)),
            "data" => new PostResource($post),
            "shares_count" => $post->shares->count(),
            "type" => $this->type,
        ];
    }
}
