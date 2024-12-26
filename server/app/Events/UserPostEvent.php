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
use App\Models\User as UserModel;
use App\Models\Post as PostModel;

use function Pest\Laravel\json;

class UserPostEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    protected $user_id;
    protected $post_id;
    protected $content;
    protected $action;
    public function __construct($user_id, $post_id, $content, $action)
    {
        $this->user_id = $user_id;
        $this->post_id = $post_id;
        $this->content = $content;
        $this->action = $action;
    }

    
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
            "action" => $this->action,
        ];
    }
}