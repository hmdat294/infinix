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
        $total_order_group = 0;

        $products = $request->input('products');
        $grouped_products = collect($products)->groupBy('shop_id');

        Log::info(  $grouped_products);

        $grouped_products->each(function ($products, $shop_id) use ($order_group, $request, &$total_order_group) {
            
            $total = 0;

            $products->each(function ($product) use (&$total) {
                $total += $product['price'] * $product['quantity'];
            });

            $total_order_group += $total;


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

        $order_group->update(['total' => $total_order_group]);

        switch ($order_group->payment_method) {
            case 'zalopay':
                return $this->createZaloPayOrder($order_group);
            case 'cash':
                $order_group->update(['payment_status' => 'paid']);
                return response()->json(['success' => true]);
            default:
                return response()->json(['error' => 'Phương thức thanh toán không hợp lệ'], 400);
        }


        
    }

    public function createZaloPayOrder($order_group)
    {
        $external_order_id = uniqid(); 

        $order_group->update(['external_order_id' => $external_order_id]);


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
        $data = $request->input('data');
        $mac = $request->input('mac');

        $calculatedMac = hash_hmac('sha256', $data, config('zalopay.key2'));
        if ($mac !== $calculatedMac) {
            return response()->json(['error' => 'Invalid MAC'], 400);
        }

        //$decodedData = json_decode($data, true);
        $external_order_id = explode('_', $data['app_trans_id'])[1];
        $order_group = OrderGroup::where('external_order_id', $external_order_id)->first();
        if (!$order_group) {
            return response()->json(['error'=> 'Không tìm thấy đơn hàng'], 404);
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
