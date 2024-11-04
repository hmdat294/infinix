<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlockedUser extends Model
{
    use HasFactory;

    protected $table = 'blocked_users';

    protected $fillable = [
        'blocker_id',
        'blocked_id'
    ];
}
