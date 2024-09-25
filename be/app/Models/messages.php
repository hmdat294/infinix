<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class messages extends Model
{
    use HasFactory;
    protected $table = 'messages';
    protected $fillable = ['conversation_id', 'message', 'image', 'user_id', "reply_id", "recalls", "created_at"];

    public function scopeMessageByConversationId($query, $conversation_id)
    {
        return $query->where('conversation_id', $conversation_id);
    }
}
