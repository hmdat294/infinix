<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostMedia extends Model
{
    use HasFactory;

    protected $table = 'post_medias';

    protected $fillable = [
        'post_id',
        'type',
        'path',
    ];

    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id');
    }


}
