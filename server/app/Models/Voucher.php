<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    use HasFactory;

    protected $table = 'vouchers';

    protected $fillable = [
        'shop_id',
        'code',
        'discount',
        'min_price',
        'max_discount',
        'usage_limit',
        'valid_from',
        'valid_until',
        'stock',
        'is_active',
        'is_unlimited',
    ];

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }
    
    public function products()
    {
        return $this->belongsToMany(Product::class, 'voucher_products', 'voucher_id', 'product_id');
    }
}