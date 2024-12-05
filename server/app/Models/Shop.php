<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Shop extends Model
{
    use HasFactory;

    protected $table = 'shops';

    protected $fillable = [
        'user_id',
        'name',
        'logo',
        'description',
        'address',
        'phone_number',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function getTotalProductsSoldAttribute()
    {
        return DB::table('order_details')
            ->join('products', 'order_details.product_id', '=', 'products.id')
            ->where('products.shop_id', $this->id)
            ->sum('order_details.quantity');
    }

    public function reviews()
    {
        return $this->hasManyThrough(Review::class, Product::class);
    }
}
