<?php

namespace App\Events;

use App\Http\Resources\CommentResource;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User as UserModel;
use App\Models\PostComment as PostCommentModel;

class UserCommentEvent implements ShouldBroadcast 
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    protected $user_id;
    protected $post_id;
    protected $comment_id;
    protected $content;

    public function __construct($user_id, $post_id, $comment_id, $content)
    {
        $this->user_id = $user_id;
        $this->post_id = $post_id;
        $this->comment_id = $comment_id;
        $this->content = $content;
    }

    
    public function broadcastOn(): array
    {
        $friend_id_array = UserModel::find($this->user_id)->friendsOf->concat(UserModel::find($this->user_id)->friendsOfMine)->pluck('id');
        $channel_array = [];
        foreach ($friend_id_array as $friend_id) {
            $channel_array[] = new PrivateChannel('user.' . $friend_id);
        }
        return $channel_array;
    }

    public function broadcastWith()
    {
        return [
            "data" => new CommentResource(PostCommentModel::find($this->comment_id)),
        ];
    }
}
