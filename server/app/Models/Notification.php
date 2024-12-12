<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $table = 'notifications';

    protected $fillable = ['user_id', 'target_user_id', 'message_id', 'post_id', 'comment_id', 'conversation_id', 'friend_request_id', 'conversation_invitation_id', 'content', 'action_type', 'is_read'];


    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function targetUser()
    {
        return $this->belongsTo(User::class, 'target_user_id');
    }

    public function message()
    {
        return $this->belongsTo(Message::class, 'message_id');
    }

    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id');
    }

    public function comment()
    {
        return $this->belongsTo(PostComment::class, 'comment_id');
    }

    public function conversation()
    {
        return $this->belongsTo(Conversation::class, 'conversation_id');
    }

    public function friendRequest()
    {
        return $this->belongsTo(FriendRequest::class, 'friend_request_id');
    }

    public function conversationInvitation()
    {
        return $this->belongsTo(ConversationInvitation::class, 'conversation_invitation_id');
    }
}
