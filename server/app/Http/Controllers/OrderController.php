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
use App\Models\VoucherUser;
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
            'external_order_id' => date('ymd') . '_' . uniqid(),
            'payment_method' => $request_data->payment_method,
            'address' => $request_data->user->address,
            'phone_number' => $request_data->user->phone_number,
            'fullname' => $request_data->user->name,
            'email' => $request_data->user->email,
            'total' => $request_data->total,
            'voucher_discount_price' => $request_data->voucher_discount_price ?? 0,
        ];
        $order_group = OrderGroup::create($order_group_data);

        if (isset($request_data->applied_voucher))
        {
            $voucher = Voucher::where('code', $request_data->applied_voucher)->first();
            $voucher->stock -= 1;
            $voucher->save();
    
            $voucher_user = VoucherUser::where('user_id', $request->user()->id)->where('voucher_id', $voucher->id)->first();
            if ($voucher_user) {
                $voucher_user->is_used = true;
                $voucher_user->use_count += 1;
    
                $voucher_user->save();
            } else {
                $voucher_user = VoucherUser::create([
                    'user_id' => $request->user()->id,
                    'voucher_id' => $voucher->id,
                    'is_used' => true,
                    'use_count' => 1,
                    'is_saved' => false
                ]);
            }
        }


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
                        'price' => $product->pivot->price,
                        'voucher_discount_price' => $product->voucher_discount_price ?? 0
                    ]
                ]);

                if ($request->user()->cart()->exists()) {
                    $request->user()->cart->products()->detach($product->id);
                }
            }
            $order->save();
            // giảm stock của sản phẩm
            $order->products()->each(function ($product) {
                $product->stock -= $product->pivot->quantity;
                $product->save();
            });
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
        $response = $this->zalopayService->create_order($external_order_id, $total, $description);
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

        if ($request->has('status')) {
            $order->status = $request->status;

            if ($request->status == 'canceled') {
                $order_group = $order->group;
                $amount = $order->total;
                $this->refund($request, $order_group->id, $amount);
                $is_all_canceled = true;
                foreach ($order_group->orders as $a_order) {
                    if ($a_order->status != 'canceled') {
                        $is_all_canceled = false;
                        break;
                    }
                }

                if ($is_all_canceled) {
                    $order_group->payment_status = 'canceled';
                    if ($order_group->payment_method == 'zalopay')
                    {
                        $order_group->payment_status = 'refunded';
                    }
                    $order_group->save();
                }
            }
        }
        if ($request->has('admin_paid')) {
            $order->admin_paid = $request->admin_paid;
        }
        $order->save();
        if ($request->status == 'canceled') {
            $order->products()->each(function ($product) {
                $product->stock += $product->pivot->quantity;
                $product->save();
            });
            if ($order->group->payment_method == 'zalopay')
            {
                $this->refund($request, $order->group);
            }
        }

        return new OrderResource($order);
    }

    public function byShop(Request $request, $shop_id)
    {
        $orders = Order::where('shop_id', $shop_id)->orderBy('created_at', 'desc')->get();

        return OrderResource::collection($orders);
    }

    public function cancel(Request $request, $id)
    {
        $order_group = OrderGroup::findOrFail($id);
        $order_group->payment_status = 'canceled';
        $order_group->save();

        $order_group->orders()->update(['status' => 'canceled']);

        $order_group->orders->each(function ($order) {
            $order->products()->each(function ($product) {
                $product->stock += $product->pivot->quantity;
                $product->save();
            });
        });

        if ($order_group->payment_method == 'zalopay')
        {
            $this->refund($request, $id);
        }

        return new OrderGroupResource($order_group);
    }

    // public function test_query_order(Request $request, $external_order_id)
    // {
    //     $response = $this->zalopayService->query_order($external_order_id);
    //     return response()->json($response);
    // }

    public function refund(Request $request, $order_id, $amount = null)
    {
        $order_group = OrderGroup::find($order_id);

        $response = $amount == null ? $this->zalopayService->refund($order_group->external_order_id, "Hoàn tiền đơn hàng #$order_group->external_order_id") : $this->zalopayService->refund_with_amount($order_group->external_order_id, "Hoàn tiền đơn hàng #$order_group->external_order_id", $amount);
        if ($response['return_code'] == 1 || $response['return_code'] == 3) {
            if ($amount == null) {
                $order_group->payment_status = 'refunded';
                $order_group->save();
            }
            return response()->json(['success' => true]);
        }
    }

    public function all_orders(Request $request)
    {
        $orders = Order::orderBy('created_at', 'desc')->get();

        return OrderResource::collection($orders);
    }

    public function show(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        return new OrderResource($order);
    }
    
}
