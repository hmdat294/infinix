<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommentLike extends Model
{
    use HasFactory;

    protected $table = 'comment_likes';

    protected $fillable = [
        'comment_id',
        'user_id',
    ];

    public function comment()
    {
        return $this->belongsTo(PostComment::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
