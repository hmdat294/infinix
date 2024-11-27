<?php

namespace Database\Seeders;

use App\Models\Shop;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $shops = Shop::all();
        foreach ($shops as $shop) {
            $shop->products()->create([
                'shop_id' => $shop->id,
                'name' => 'Product 1',
                'price'=> 1000,
                'category_id' => $shop->categories->first()->id,
            ]);
        }
    }
}
