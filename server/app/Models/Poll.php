<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Poll extends Model
{
    use HasFactory;

    protected $table = 'polls';

    protected $fillable = [
        'post_id',
        'end_at',
    ];

    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id');
    }

    public function options()
    {
        return $this->hasMany(PollOption::class, 'poll_id', 'id');
    }
}
