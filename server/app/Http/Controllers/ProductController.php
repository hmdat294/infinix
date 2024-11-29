<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use Illuminate\Http\Request;
use App\Models\Product as ProductModel;
use App\Models\ProductImage as ProductImageModel;

class ProductController extends Controller
{
    public function index() {
        $products = ProductModel::all()->sortByDesc('created_at');

        return ProductResource::collection($products);
    }

    public function store(Request $request) {
        $product_data = $request->only([
            'shop_id',
            'category_id',
            'name',
            'description',
            'price',
            'discount',
            'stock',
            'is_active',
        ]);

        $product = ProductModel::create($product_data);


        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $image_path = asset('storage/' . $image->store('uploads', 'public'));
                ProductImageModel::create([
                    'product_id' => $product->id,
                    'image' => $image_path,
                ]);
            }
        }

        return new ProductResource($product);
    }

    public function show($id) {
        $product = ProductModel::findOrFail($id);

        return new ProductResource($product);
    }

    public function update(Request $request, $id) {
        $product_data = $request->only([
            'shop_id',
            'category_id',
            'name',
            'description',
            'price',
            'discount',
            'stock',
            'is_active',
        ]);

        $product = ProductModel::findOrFail($id);
        $product->update($product_data);

        $product->images()->delete();

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $image_path = asset('storage/' . $image->store('uploads', 'public'));
                ProductImageModel::create([
                    'product_id' => $product->id,
                    'image' => $image_path,
                ]);
            }
        }

        if ($request->has('urls')) {
            foreach ($request->urls as $url) {
                ProductImageModel::create([
                    'product_id' => $product->id,
                    'image' => $url,
                ]);
            }
        }

        return new ProductResource($product);
    }

    public function destroy($id) {
        $product = ProductModel::findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function search(Request $request) {
        $products = ProductModel::where('name', 'like', '%' . $request->query('q') . '%')->get();

        return ProductResource::collection($products);
    }

    public function byShop(Request $request, $shop_id) {
        $products = ProductModel::where('shop_id', $shop_id)->get();

        return ProductResource::collection($products);
    }

    public function byCategory(Request $request, $category_id) {
        $products = ProductModel::where('category_id', $category_id)->get();

        return ProductResource::collection($products);
    }
}
