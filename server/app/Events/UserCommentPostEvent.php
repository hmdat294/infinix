<?php

namespace App\Events;

use App\Http\Resources\CommentResource;
use App\Http\Resources\UserResource;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User as UserModel;
use App\Models\PostComment as PostCommentModel;
use App\Models\Post as PostModel;

class UserCommentPostEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    protected $user_id;
    protected $post_id;
    protected $comment_id;
    protected $content;
    protected $type;

    public function __construct($user_id, $post_id, $comment_id, $content, $type)
    {
        $this->user_id = $user_id;
        $this->post_id = $post_id;
        $this->comment_id = $comment_id;
        $this->content = $content;
        $this->type = $type;
    }

    
    public function broadcastOn(): array
    {
        $user_comment_id = $this->user_id;
        $user_post_id = PostModel::find($this->post_id)->user->id;

        return [
            new Channel('user.'.$user_comment_id),
            new Channel('user.'.$user_post_id),
        ];
    }

    public function broadcastWith()
    {
        return [
            "user_comment" => new UserResource(UserModel::find($this->user_id)),
            "data" => new CommentResource(PostCommentModel::find($this->comment_id)),
            "comments_count" => PostModel::find($this->post_id)->comments->count(),
            "type" => $this->type,
        ];
    }
}
