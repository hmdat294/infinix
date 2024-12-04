<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Product extends Model
{
    use HasFactory;

    protected $table = 'products';

    protected $fillable = [
        'shop_id',
        'name',
        'category_id',
        'description',
        'image',
        'price',
        'discount',
        'stock',
        'is_active',
    ];

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function getTotalSoldAttribute()
    {
        return DB::table('order_details')
            ->join('orders', 'order_details.order_id', '=', 'orders.id')
            ->where('order_details.product_id', $this->id)
            ->where('orders.status', 'delivered')
            ->sum('order_details.quantity');
    }

    public function getAverageRatingAttribute()
    {
        return $this->reviews()->avg('rating');
    }
}
