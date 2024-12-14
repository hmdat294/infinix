<?php

namespace App\Services;

use App\Models\OrderGroup;
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

    public function create_order($external_order_id, $amount, $description)
    {

        $embeddata = '{"redirecturl": "http://localhost:4200/store/?tab=tab_order"}';

        $order = [
            "app_id" => $this->config["app_id"],
            "app_time" => round(microtime(true) * 1000),
            "app_trans_id" => $external_order_id,
            "app_user" => "Infinix",
            "item" => json_encode([]),
            "embed_data" => $embeddata,
            "amount" => $amount,
            "description" => $description,
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

    // app_trans_id = external_order_id
    public function query_order($external_order_id)
    {
        $data = [
            'app_id' => $this->config['app_id'],
            'app_trans_id' => $external_order_id,
        ];

        $data['mac'] = hash_hmac('sha256', implode('|', [
            $data['app_id'],
            $data['app_trans_id']
        ]), $this->config['key1']);

        $context = stream_context_create([
            "http" => [
                "header" => "Content-type: application/x-www-form-urlencoded\r\n",
                "method" => "POST",
                "content" => http_build_query($data)
            ]
        ]);
        
        $resp = file_get_contents($this->config["endpoint_query"], false, $context);
        $result = json_decode($resp, true);

        return $result;
    }

    public function refund($order_id, $description)
    {
        $order_group = OrderGroup::find($order_id);

    }
}
