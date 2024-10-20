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

class UserSharePostEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    protected $post_id;
    protected $user_id;

    public function __construct($post_id, $user_id)
    {        
        $channel_array = [];

        $this->post_id = $post_id;
        $this->user_id = $user_id;
    }
    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {

        $recipient_id_array = UserModel::find($this->user_id)->friendsOf->concat(UserModel::find($this->user_id)->friendsOfMine)->pluck('id');
        $recipient_id_array[] = $this->user_id;
        $recipient_id_array = $recipient_id_array->concat(UserModel::find($this->user_id)->followers->pluck('id'));
        
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
            "data" => new PostResource($post),
        ];
    }
}
