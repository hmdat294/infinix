<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Http\Resources\OrderGroupResource;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderGroup;
use App\Models\User;
use Illuminate\Support\Facades\Log;


class OrderController extends Controller
{
    public function index(Request $request) {
        $order_groups = OrderGroup::where('user_id', $request->user()->id)->orderBy('created_at', 'desc')->get();

        return OrderGroupResource::collection($order_groups);
    }

    /**
     * body data:
     * total, payment_method, payment_status, address, phone_number, fullname, email
     * products: [{id, shop_id, price, quantity}]
     * notes: [shop_id => note]
     */
    public function store(Request $request)
    {

        $order_group_data = $request->only(['payment_method', 'payment_status', 'address', 'phone_number', 'fullname']);
        $order_group_data['user_id'] = $request->user()->id;

        $order_group = OrderGroup::create($order_group_data);

        $products = $request->input('products');
        $grouped_products = collect($products)->groupBy('shop_id');

        Log::info(  $grouped_products);

        $grouped_products->each(function ($products, $shop_id) use ($order_group, $request) {
            
            $total = 0;

            $products->each(function ($product) use (&$total) {
                $total += $product['price'] * $product['quantity'];
            });


            $order_data = [
                'user_id' => $request->user()->id,
                'total' => $total,
                'status' => 'pending',
                'note' => $request->input('notes.' . $shop_id),
                'shop_id' => $shop_id,
                'order_group_id' => $order_group->id
            ];

            $order = Order::create($order_data);

            $products->each(function ($product) use ($order) {
                $product_id = $product['id'];
                $product_price = $product['price'];
                $product_quantity = $product['quantity'];

                $order->products()->syncWithoutDetaching([
                    $product_id => [
                        'quantity' => $product_quantity,
                        'price' => $product_price
                    ]
                ]);
            });

            $order_group->orders()->save($order);
        });

        return new OrderGroupResource($order_group);
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $order->update($request->only(['status']));

        return new OrderResource($order);
    }
}
