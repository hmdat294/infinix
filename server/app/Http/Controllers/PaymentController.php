<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

use function Illuminate\Log\log;
use function Pest\Laravel\json;

class PaymentController extends Controller
{
    public function vnpay_payment(Request $request)
    {
        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_HashSecret = "SIG8XEKEAFCMZY98NMKGKII5T4GFVE85";

        $vnp_TxnRef = date("ymd") . "_" . uniqid();
        $vnp_OrderInfo = 'Thanh toán'; //Thông tin đơn hàng
        $vnp_OrderType = 'Infinix'; //Loại đơn hàng
        $vnp_Amount = $request->price * 100;
        $vnp_BankCode = 'NCB';

        $inputData = array(
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => "H8N4559G",
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $_SERVER['REMOTE_ADDR'],
            "vnp_Locale" => 'vn',
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => "http://localhost:4200/",
            "vnp_TxnRef" => $vnp_TxnRef
        );

        if (isset($vnp_BankCode) && $vnp_BankCode != "") {
            $inputData['vnp_BankCode'] = $vnp_BankCode;
        }

        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";

        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = $vnp_Url . "?" . $query;
        if (isset($vnp_HashSecret)) {
            $vnpSecureHash =   hash_hmac('sha512', $hashdata, $vnp_HashSecret); //  
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }

        return response()->json([
            'url' => $vnp_Url
        ]);
    }

    public function zalopay_payment(Request $request)
    {
        $appid = 553;
        $key1 = "9phuAOYhan4urywHTh0ndEXiV3pKHr5Q";
        $endpoint = "https://sandbox.zalopay.com.vn/v001/tpe/createorder";

        $embeddata = [
            "merchantinfo" => "embeddata123"
        ];
        $items = [
            ["itemid" => "knb", "itemname" => "kim nguyen bao", "itemprice" => 198400, "itemquantity" => 1]
        ];

        $order = [
            "appid" => $appid,
            "apptime" => round(microtime(true) * 1000),
            "apptransid" => date("ymd") . "_" . uniqid(),
            "appuser" => "demo",
            "item" => json_encode($items, JSON_UNESCAPED_UNICODE),
            "embeddata" => json_encode($embeddata, JSON_UNESCAPED_UNICODE),
            "amount" => $request->price,
            "description" => "ZaloPay Integration Demo",
            "bankcode" => "zalopayapp",
            // 'callbackurl' => route('callback-payment'),
        ];

        // Tạo mã xác thực (MAC)
        $data = $order["appid"] . "|" . $order["apptransid"] . "|" . $order["appuser"] . "|" . $order["amount"]
            . "|" . $order["apptime"] . "|" . $order["embeddata"] . "|" . $order["item"];
        $order["mac"] = hash_hmac("sha256", $data, $key1);

        $response = Http::asForm()->post($endpoint, $order);
        $result = $response->json();

        if ($response->successful() && isset($result['orderurl'])) {
            return response()->json(['url' => $result['orderurl']]);
        } else {
            Log::error('ZaloPay payment error:', $result);
            return response()->json(['error' => 'Failed to create ZaloPay order.'], 500);
        }
    }

    public function callback_payment(Request $request)
    {
        $result = [];
        $key2 = "Iyz2habzyr7AG8SgvoBCbKwKi3UzlLi3";

        $postdata = $request->getContent();
        $postdatajson = json_decode($postdata, true);

        if (!$postdatajson) {
            Log::error('ZaloPay callback: Invalid JSON input.');
            return response()->json(['return_code' => 0, 'return_message' => 'Invalid input.']);
        }

        $mac = hash_hmac("sha256", $postdatajson["data"], $key2);
        $requestmac = $postdatajson["mac"];

        // Kiểm tra tính hợp lệ của callback
        if (strcmp($mac, $requestmac) != 0) {
            Log::warning('ZaloPay callback: MAC mismatch.');
            $result["return_code"] = -1;
            $result["return_message"] = "MAC mismatch.";




            
        } else {
            Log::info('ZaloPay callback: Successful payment.', $postdatajson);

            $result["return_code"] = 1;
            $result["return_message"] = "Success";
        }

        return response()->json($result);
    }
}
