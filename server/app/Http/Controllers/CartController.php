<?php

namespace App\Http\Controllers;

use App\Http\Resources\CartResource;
use App\Models\Cart as CartModel;
use App\Models\Product as ProductModel;

use Illuminate\Http\Request;

class CartController extends Controller
{
    public function show(Request $request, $id)
    {
        $cart = CartModel::find($id);

        if (!$cart) {
            return $this->store($request);
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

    public function addProduct(Request $request, $id)
    {
        $cart = CartModel::find($id);

        $product_id = $request->input('product_id');
        $quantity = $request->input('quantity');

        $product = ProductModel::find($product_id);



        $cart->products()->attach($product, [
            'quantity' => $quantity
        ]);

        $cart->save();

        return new CartResource($cart);
    }

    public function removeProduct(Request $request, $id)
    {
        $cart = CartModel::find($id);

        $product_id = $request->input('product_id');

        $cart->products()->detach($product_id);

        $cart->save();

        return new CartResource($cart);
    }

    public function updateProduct(Request $request, $id)
    {
        $cart = CartModel::find($id);

        $product_id = $request->input('product_id');
        $quantity = $request->input('quantity');

        $cart->products()->updateExistingPivot($product_id, [
            'quantity' => $quantity
        ]);

        $cart->save();

        return new CartResource($cart);
    }

    public function destroy(Request $request, $id)
    {
        $cart = CartModel::find($id);

        $cart->products()->detach();

        $cart->delete();

        return response()->json([
            'message' => 'Cart deleted'
        ]);
    }
}
