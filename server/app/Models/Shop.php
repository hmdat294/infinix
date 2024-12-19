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
        'bank_name',
        'bank_account_number',
        'is_active',
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
            ->join('orders', 'order_details.order_id', '=', 'orders.id')
            ->where('orders.status', 'delivered')
            ->sum('order_details.quantity');
    }


    public function reviews()
    {
        return $this->hasManyThrough(Review::class, Product::class);
    }

    public function vouchers()
    {
        return $this->hasMany(Voucher::class);
    }

    public function getTotalRevenueAttribute()
    {
        $totalRevenue = DB::table('order_details')
            ->join('orders', 'order_details.order_id', '=', 'orders.id')
            ->where('orders.status', 'delivered')
            ->where('orders.admin_paid', true)
            ->where('orders.shop_id', $this->id)
            ->sum(DB::raw('order_details.quantity * order_details.price'));
    
        return $totalRevenue * 0.95;
    }
}
