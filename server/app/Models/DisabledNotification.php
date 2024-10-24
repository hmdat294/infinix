<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DisabledNotification extends Model
{
    use HasFactory;

    protected $table = 'disabled_notifications';

    protected $fillable = [
        'user_id',
        'target_user_id',
        'conversation_id',
        'post_id',
        'type',
        'enabled_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function targetUser()
    {
        return $this->belongsTo(User::class, 'target_user_id');
    }

    public function conversation()
    {
        return $this->belongsTo(Conversation::class, 'conversation_id');
    }

    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id');
    }
}
