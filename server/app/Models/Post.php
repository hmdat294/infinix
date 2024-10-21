<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\PostComment as PostCommentModel;

class Post extends Model
{
    use HasFactory;

    protected $table = 'posts';

    protected $fillable = [
        'user_id',
        'content',
        'post_type',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function medias()
    {
        return $this->hasMany(PostMedia::class, 'post_id', 'id');
    }

    public function poll()
    {
        return $this->hasOne(Poll::class, 'post_id', 'id');
    }

    public function comments()
    {
        return $this->hasMany(PostComment::class, 'post_id', 'id');
    }

    public function bookmarks()
    {
        return $this->hasMany(PostBookmark::class, 'post_id', 'id');
    }

    public function likes()
    {
        return $this->hasMany(PostLike::class, 'post_id', 'id');
    }

    public function shares()
    {
        return $this->hasMany(PostShare::class, 'post_id', 'id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'post_id', 'id');
    }

    public function disabled_notifications()
    {
        return $this->hasMany(DisabledNotification::class, 'post_id', 'id');
    }

    public function toArray()
    {
        $data = parent::toArray();

        $data['user'] = $this->user;
        $data['medias'] = $this->medias;

        $data['poll'] = $this->poll;

        $data['likes_count'] = $this->likes()->count();
        $data['comments_count'] = $this->comments()->count();
        $data['shares_count'] = $this->shares()->count();
        $data['bookmarks_count'] = $this->bookmarks()->count();

        $data['newest_comment'] = $this->comments()->orderBy('created_at', 'desc')->first();

        return $data;
    }
}
