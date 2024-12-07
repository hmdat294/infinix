<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderGroup extends Model
{
    use HasFactory;

    protected $table = 'order_groups';

    protected $fillable = [
        'user_id',
        'external_order_id',
        'total',
        'payment_method',
        'payment_status',
        'fullname',
        'email',
        'address',
        'phone_number',
        'email',
        'voucher_discount_price',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function products()
    {
        return $this->hasManyThrough(Product::class, Order::class);
    }

    public function voicher()
    {
        return $this->hasMany(Voucher::class, 'applied_voucher_id');
    }
}
