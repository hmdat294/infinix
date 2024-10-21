<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostComment extends Model
{
    use HasFactory;

    protected $table = 'post_comments';

    protected $fillable = [
        'post_id',
        'user_id',
        'content',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id');
    }

    public function toArray()
    {
        $data = parent::toArray();

        $data['user'] = $this->user;
        $data['post'] = $this->post;

        

        $data['created_at'] = $this->created_at->format('Y-m-d H:i:s');
        $data['updated_at'] = $this->updated_at->format('Y-m-d H:i:s');

        $data['created_at_time'] = $this->created_at->format('H:i:s');
        $data['updated_at_time'] = $this->updated_at->format('H:i:s');

        $data['created_at_date'] = $this->created_at->format('Y-m-d');
        $data['updated_at_date'] = $this->updated_at->format('Y-m-d');

        return $data;
    }
}
