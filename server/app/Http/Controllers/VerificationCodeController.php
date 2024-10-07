<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VerificationCodeModel;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationCodeNotification;

class VerificationCodeController extends Controller
{
    public function verify(Request $request)
    {
        $request->validate([
            'code' => 'required|numeric|digits:6',
            'contact_info' => ['required', function($attribute, $value, $fail) {
                if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    if (!preg_match('/^0[0-9]{9,10}$/', $value)) {
                        $fail($attribute . ' is not a valid email or phone number.');
                    }
                }
            }],
        ]);

        $phone_number = preg_match('/^0[0-9]{9,10}$/', $request->contact_info) ? $request->contact_info : null;
        $email = filter_var($request->contact_info, FILTER_VALIDATE_EMAIL) ? $request->contact_info : null;
    
        if (!$phone_number && !$email) {
            return response()->json([
                'message' => 'Invalid contact info',
            ], 400);
        }

        $verifyCode = (new VerificationCodeModel)->verifyCode($request->code, $email, $phone_number);

        return response()->json([
            'message' => $verifyCode ? 'Verification code is correct' : 'Verification code is incorrect',
        ]);


    }

    public function create(Request $request)
    {
        $request->validate([
            'contact_info' => ['required', function($attribute, $value, $fail) {
                if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    if (!preg_match('/^0[0-9]{9,10}$/', $value)) {
                        $fail($attribute . ' is not a valid email or phone number.');
                    }
                }
            }],
        ]);
    
        $phone_number = preg_match('/^0[0-9]{9,10}$/', $request->contact_info) ? $request->contact_info : null;
        $email = filter_var($request->contact_info, FILTER_VALIDATE_EMAIL) ? $request->contact_info : null;
    
        if (!$phone_number && !$email) {
            return response()->json([
                'message' => 'Invalid contact info',
            ], 400);
        }
    
        $code = (new VerificationCodeModel)->generateVerificationCode($email, $phone_number);
        if ($email) {
            Mail::to($email)->queue(new VerificationCodeNotification($code));
        }
    
        return response()->json([
            'message' => 'Verification code has been sent to your contact info',
        ]);
    }
    
}
