<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Http\Resources\OrderGroupResource;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderGroup;
use App\Models\User;
use Illuminate\Support\Facades\Log;

use App\Services\ZaloPayService;


class OrderController extends Controller
{

    protected $zalopayService;

    public function __construct(ZaloPayService $zalopayService)
    {
        $this->zalopayService = $zalopayService;
    }

    public function index(Request $request) {
        Log::info('index: ' . json_encode($request->all()));
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
        Log::info('store: ' . json_encode($request->all()));
        $order_group_data = $request->only(['payment_method', 'address', 'phone_number', 'fullname']);
        $order_group_data['user_id'] = $request->user()->id;

        $order_group = OrderGroup::create($order_group_data);
        $total_order_group = 0;

        $products = $request->input('products');
        $grouped_products = collect($products)->groupBy('shop_id');

        Log::info($grouped_products);

        foreach ($grouped_products as $shop_id => $products) {
            $total = 0;

            foreach ($products as $product) {
                $total += $product['price'] * $product['quantity'];
                Log::info('total: ' . $total);
            }

            $total_order_group += $total;
            Log::info('total_order_group: ' . $total_order_group);

            $order_data = [
                'user_id' => $request->user()->id,
                'total' => $total,
                'status' => 'pending',
                'note' => $request->input('notes.' . $shop_id),
                'shop_id' => $shop_id,
                'order_group_id' => $order_group->id
            ];

            $order = Order::create($order_data);

            foreach ($products as $product) {
                $product_id = $product['id'];
                $product_price = $product['price'];
                $product_quantity = $product['quantity'];

                $order->products()->syncWithoutDetaching([
                    $product_id => [
                        'quantity' => $product_quantity,
                        'price' => $product_price
                    ]
                ]);
            }

            $order_group->orders()->save($order);
        }

        $order_group->total = $total_order_group;
        $order_group->save();
        Log::info('total_order_group updated: ' . $order_group->total);

        switch ($order_group->payment_method) {
            case 'zalopay':
                return $this->createZaloPayOrder($order_group->id);
            case 'cash':
                $order_group->update(['payment_status' => 'paid']);
                return response()->json(['success' => true]);
            default:
                return response()->json(['error' => 'Phương thức thanh toán không hợp lệ'], 400);
        }
    }


    public function createZaloPayOrder($order_group_id)
    {

        $order_group = OrderGroup::findOrFail($order_group_id);
        Log::info('external_order_id old: ' . $order_group->external_order_id);
        $external_order_id = uniqid(); 
        Log::info('external_order_id: ' . $external_order_id);
        $order_group->external_order_id = $external_order_id;
        $order_group->save();

        
        Log::info('external_order_id new: ' . $order_group->external_order_id);


        $description = "Thanh toán đơn hàng #$external_order_id";

        $response = $this->zalopayService->createOrder($external_order_id, $order_group->total, $description);

        if ($response['return_code'] == 1) {
            return response()->json(['order_url' => $response['order_url'], 'success' => true]);
        }

        return response()->json(['error' => $response['return_message']], 400);
    }

    public function callback(Request $request)
    {
        Log::info('callback: ' . json_encode($request->all()));
        $data = json_decode($request->input('data'), true); 
        $mac = $request->input('mac');

        // $calculatedMac = hash_hmac('sha256', json_encode($data), config('zalopay.key2'));
        // if ($mac !== $calculatedMac) {
        //     Log::info('Invalid MAC');
        // }

        $external_order_id = explode('_', $data['app_trans_id'])[1];
        $order_group = OrderGroup::where('external_order_id', $external_order_id)->first();
        if (!$order_group) {
            //return response()->json(['error'=> 'Không tìm thấy đơn hàng'], 404);
            Log::info('Không tìm thấy đơn hàng');
        }

        $order_group->update(['payment_status' => 'paid']);

        return response()->json(['success' => true]);
    }


    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $order->update($request->only(['status']));

        return new OrderResource($order);
    }
}
