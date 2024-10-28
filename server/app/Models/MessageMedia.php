<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MessageMedia extends Model
{
    use HasFactory;

    protected $table = 'message_medias';

    protected $fillable = [
        'message_id',
        'type',
        'path',
    ];

    public function message()
    {
        return $this->belongsTo(Message::class, 'message_id');
    }
}
