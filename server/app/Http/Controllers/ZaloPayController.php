<?php

namespace App\Http\Controllers;

use App\Services\ZaloPayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

use function Pest\Laravel\json;

class ZaloPayController extends Controller
{
    protected $zalopayService;

    public function __construct(ZaloPayService $zalopayService)
    {
        $this->zalopayService = $zalopayService;
    }

    public function createOrder(Request $request)
    {
        $order_id = uniqid(); 
        $amount = $request->input('amount');
        $description = "Thanh toán đơn hàng #$order_id";

        $response = $this->zalopayService->createOrder($order_id, $amount, $description);

        if ($response['return_code'] == 1) {
            return response()->json($response);
        }

        return response()->json(['error' => $response['return_message']], 400);
    }

    public function handleCallback(Request $request)
    {
        Log::info('callback: ' . json_encode($request->all()));
        $data = $request->input('data');
        $mac = $request->input('mac');

        $calculatedMac = hash_hmac('sha256', $data, config('zalopay.key2'));
        if ($mac !== $calculatedMac) {
            return response()->json(['error' => 'Invalid MAC'], 400);
        }

        $decodedData = json_decode($data, true);

        return response()->json(['success' => true]);
    }
}
