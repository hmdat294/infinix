<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VerificationCode;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationCodeNotification;

class VerificationCodeController extends Controller
{
    /**
     * - 400: Thông tin liên hệ không hợp lệ
     * - 400: Mã xác thực không hợp lệ
     * - 200: Mã xác thực chính xác
     */
    public function verify(Request $request)
    {

        $verifyCode = (new VerificationCode)->verifyCode($request->code, $request->email, null);

        return response()->json([
            'message' => $verifyCode ? 'Xác minh thành công!' : 'Xác minh không thành công!',
            'verify' => $verifyCode ? true : false,
        ]); // $verifyCode ? 200 : 400
    }

    /**
     * - 400: Thông tin liên hệ không hợp lệ
     * - 200: Mã xác thực đã được gửi đến thông tin liên hệ
     */
    public function create(Request $request)
    {
        $email = $request->email;

        $code = (new VerificationCode())->generateVerificationCode($email, null);
        if ($email) {
            Mail::to($email)->queue(new VerificationCodeNotification($code));
        }

        return response()->json([
            'message' => 'Mã xác minh đã được gửi, vui lòng kiểm tra email để nhận mã!',
        ]); // status: 200
    }
}
