<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class relationship extends Model
{
    use HasFactory;
    protected $table = 'relationship';
    protected $fillable = ['user_id', 'related_user_id', 'relationship_type'];
}
