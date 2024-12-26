<?php

namespace App\Http\Controllers;

use App\Http\Resources\CartResource;
use App\Models\Cart as CartModel;
use App\Models\Product as ProductModel;

use Illuminate\Support\Facades\Log;

use Illuminate\Http\Request;

class CartController extends Controller
{
    public function show(Request $request)
    {
        $cart = CartModel::where('user_id', $request->user()->id)->first();

        if (!$cart) {
            $this->store($request);
            $cart = CartModel::where('user_id', $request->user()->id)->first();
        }

        $cart['products'] = $cart->products ?? [];

        return new CartResource($cart);
    }

    public function store(Request $request)
    {
        $cart = CartModel::create([
            'user_id' => $request->user()->id,
            'total' => 0
        ]);

        return new CartResource($cart);
    }

    public function addProduct(Request $request)
    {
        $cart = CartModel::where('user_id', $request->user()->id)->first();

        if (!$cart) {
            $this->store($request);
            $cart = CartModel::where('user_id', $request->user()->id)->first();
        }

        $product_id = $request->input('product_id');
        $product = ProductModel::find($product_id);
        $quantity = $request->input('quantity') ?? 1;
        $price = $request->input('price') ?? $product->price * (100 - $product->discount) / 100;
        $product = ProductModel::find($product_id);

        $old_quantity = $cart->products()->find($product_id)->pivot->quantity ?? 0;

        $quantity += $old_quantity;

        $cart->products()->syncWithoutDetaching([
            $product_id => [
                'quantity' => $quantity,
                'price' => $price
            ]
        ]);

        $cart->save();

        return new CartResource($cart);
    }

    public function removeProduct(Request $request)
    {
        $cart = CartModel::where('user_id', $request->user()->id)->first();

        if (!$cart) {
            $this->store($request);
            $cart = CartModel::where('user_id', $request->user()->id)->first();
        }

        $product_id = $request->input('product_id');

        $cart->products()->detach($product_id);

        $cart->save();

        return new CartResource($cart);
    }

    public function updateProduct(Request $request)
    {
        $cart = CartModel::where('user_id', $request->user()->id)->first();

        $product_id = $request->input('product_id');
        $product = ProductModel::find($product_id);
        $quantity = $request->input('quantity') ?? 1;
        $price = $request->input('price') ?? $product->price * (100 - $product->discount) / 100;
        $product = ProductModel::find($product_id);

        $cart->products()->syncWithoutDetaching([
            $product_id => [
                'quantity' => $quantity,
                'price' => $price
            ]
        ]);

        $cart->save();

        return new CartResource($cart);
    }

    public function destroy(Request $request)
    {
        $cart = CartModel::where('user_id', $request->user()->id)->first();

        if ($cart) {  

            $cart->products()->detach();

            $cart->delete();
        }

        return response()->json([
            'message' => 'Cart deleted'
        ]);
    }
}
