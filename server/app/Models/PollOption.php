<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PollOption extends Model
{
    use HasFactory;

    protected $table = 'poll_options';

    protected $fillable = [
        'poll_id',
        'option',
    ];

    public function poll()
    {
        return $this->belongsTo(Poll::class, 'poll_id');
    }

    public function votes()
    {
        return $this->hasMany(Vote::class, 'poll_option_id');
    }

    public function toArray()
    {
        $data = parent::toArray();
        $data['total_option_votes'] = $this->votes->count();
        return $data;
    }
}
