<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShopRequest extends Model
{
    use HasFactory;

    protected $table = 'shop_requests';

    protected $fillable = [
        'shop_id',
        'user_id',
    ];
}
