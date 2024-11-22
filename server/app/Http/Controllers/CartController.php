<?php

namespace App\Http\Controllers;

use App\Http\Resources\CartResource;
use App\Models\Cart as CartModel;
use App\Models\Product as ProductModel;

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
        $quantity = $request->input('quantity');

        $product = ProductModel::find($product_id);

        if ($cart->products->contains($product_id)) {
            $quantity += $cart->products->find($product_id)->pivot->quantity;
        }


        $cart->products()->attach($product, [
            'quantity' => $quantity
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

        if (!$cart) {
            $this->store($request);
            $cart = CartModel::where('user_id', $request->user()->id)->first();
        }

        $product_id = $request->input('product_id');
        $quantity = $request->input('quantity');

        $cart->products()->updateExistingPivot($product_id, [
            'quantity' => $quantity
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
