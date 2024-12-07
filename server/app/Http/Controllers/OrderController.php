<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Http\Resources\OrderGroupResource;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderGroup;
use App\Models\Product;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Support\Facades\Log;

use App\Services\ZaloPayService;

use function Pest\Laravel\json;

class OrderController extends Controller
{

    protected $zalopayService;

    public function __construct(ZaloPayService $zalopayService)
    {
        $this->zalopayService = $zalopayService;
    }

    public function index(Request $request)
    {
        Log::info('index: ' . json_encode($request->all()));
        $order_groups = OrderGroup::where('user_id', $request->user()->id)->orderBy('created_at', 'desc')->get();

        return OrderGroupResource::collection($order_groups);
    }


    public function store(Request $request)
    {
        $request_data = json_decode($request->input('order'));
        $order_group_data = [
            'user_id' => $request->user()->id,
            'external_order_id' => uniqid(),
            'payment_method' => $request_data->payment_method,
            'address' => $request_data->user->address,
            'phone_number' => $request_data->user->phone_number,
            'fullname' => $request_data->user->name,
            'email' => $request_data->user->email,
            'total' => $request_data->total,
            'voucher_discount_price' => $request_data->voucher_discount_price ?? 0,
        ];
        $order_group = OrderGroup::create($order_group_data);

        $voucher = Voucher::where('code', $request_data->applied_voucher)->first();
        $voucher->stock -= 1;
        $voucher->save();

        $shops = $request_data->shops;
        foreach ($shops as $shop) {
            $order_data = [
                'user_id' => $request->user()->id,
                'shop_id' => $shop->shop_id,
                'order_group_id' => $order_group->id,
                'total' => $shop->shop_total,
                'note' => $shop->note ?? ''
            ];

            $order = Order::create($order_data);

            $products = $shop->products;
            foreach ($products as $product) {
                $order->products()->attach([
                    $product->id => [
                        'quantity' => $product->pivot->quantity,
                        'price' => $product->pivot->price
                    ]
                ]);

                $detail_product = Product::find($product->id);
                $detail_product->stock -= $product->pivot->quantity;
                $detail_product->save();

                if ($request->user()->cart()->exists()) {
                    $request->user()->cart->products()->detach($product->id);
                }
            }
            $order->save();
        }

        switch ($request_data->payment_method) {
            case 'zalopay':
                return $this->create_zalopay_order($order_group->external_order_id, $order_group->total);
            default:
                return response()->json(['order_url' => 'http://localhost:4200/store/?tab=tab_order', 'success' => true]);
        }
    }

    public function create_zalopay_order($external_order_id, $total)
    {
        $description = "Thanh toán đơn hàng #$external_order_id";
        $response = $this->zalopayService->createOrder($external_order_id, $total, $description);
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
            return response()->json(['error' => 'Không tìm thấy đơn hàng'], 404);
        }

        $order_group->update(['payment_status' => 'paid']);

        // $user = User::find($order_group->user_id);

        // $products = $order_group->products();
        // $products->each(function ($product) use ($user) {
        //     $user->cart()->products()->detach($product->id);
        // });

        return response()->json(['success' => true]);
    }


    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $order->update($request->only(['status']));

        return new OrderResource($order);
    }

    public function byShop(Request $request, $shop_id)
    {
        $orders = Order::where('shop_id', $shop_id)->get();

        return OrderResource::collection($orders);
    }
}
