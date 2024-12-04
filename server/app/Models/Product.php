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
            ->where('product_id', $this->id)
            ->sum('quantity');
    }
}
