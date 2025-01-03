<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $table = 'messages';

    protected $fillable = [
        'conversation_id',
        'reply_to_message_id',
        'user_id',
        'link',
        'is_recalled',
        'is_edited',
        'is_call',
        'content'
    ];

    public function conversation()
    {
        return $this->belongsTo(Conversation::class, 'conversation_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function replyToMessage()
    {
        return $this->belongsTo(Message::class, 'reply_to_message_id', 'id');
    }

    public function medias()
    {
        return $this->hasMany(MessageMedia::class, 'message_id', 'id');
    }

    public function likes()
    {
        return $this->belongsToMany(User::class, 'message_likes', 'message_id', 'user_id');
    }
}
