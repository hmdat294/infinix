<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

use function Pest\Laravel\json;

class ZaloPayService
{
    protected $config;

    public function __construct()
    {
        $this->config = config('zalopay');
    }

    public function createOrder($order_id, $amount, $description)
    {

        $embeddata = '{"redirecturl": "http://localhost:4200"}';
        $order = [
            "app_id" => $this->config["app_id"],
            "app_time" => round(microtime(true) * 1000),
            "app_trans_id" => date('ymd') . '_' . $order_id,
            "app_user" => "Infinix",
            "item" => json_encode([]),
            "embed_data" => $embeddata,
            "amount" => 50000,
            "description" => "Thanh toán đơn hàng #$order_id",
            "callback_url" => $this->config['callback_url'],
            "bank_code" => "",
        ];

        $order["mac"] = hash_hmac('sha256', implode('|', [
            $order['app_id'],
            $order['app_trans_id'],
            $order['app_user'],
            $order['amount'],
            $order['app_time'],
            $order['embed_data'],
            $order['item']
        ]), $this->config['key1']);
        
        $context = stream_context_create([
            "http" => [
                "header" => "Content-type: application/x-www-form-urlencoded\r\n",
                "method" => "POST",
                "content" => http_build_query($order)
            ]
        ]);
        
        $resp = file_get_contents($this->config["endpoint_create"], false, $context);
        $result = json_decode($resp, true);

        return $result;
    }

    public function queryOrder($appTransId)
    {
        $data = [
            'app_id' => $this->config['app_id'],
            'app_trans_id' => $appTransId,
        ];

        $data['mac'] = hash_hmac('sha256', implode('|', [
            $data['app_id'],
            $data['app_trans_id']
        ]), $this->config['key1']);

        $response = Http::post($this->config['endpoint_query'], $data);

        return $response->json();
    }
}
