<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use Illuminate\Http\Request;
use App\Models\Product as ProductModel;

class ProductController extends Controller
{
    public function index() {

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

        if ($request->hasFile('image')) {
            $product_data['image'] = asset('storage/' . $request->file('image')->store('uploads', 'public'));
        }

        $product = ProductModel::create($product_data);

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

        if ($request->hasFile('image')) {
            $product_data['image'] = asset('storage/' . $request->file('image')->store('uploads', 'public'));
        }

        $product = ProductModel::findOrFail($id);
        $product->update($product_data);

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
}
