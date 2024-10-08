<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VerificationCodeModel extends Model
{
    use HasFactory;

    protected $table = 'verification_codes';

    protected $fillable = [
        'email',
        'phone_number',
        'code',
        'is_used',
        'expired_at',
    ];

    public function generateVerificationCode($email, $phone_number)
    {
        do {
            $code = rand(100000, 999999);
        } while (self::where('code', $code)->exists());
        $expired_at = now()->addMinutes(5);

        $this->create([
            'email' => $email,
            'phone_number' => $phone_number,
            'code' => $code,
            'is_used' => false,
            'expired_at' => $expired_at,
        ]);

        return $code;
    }

    public function verifyCode($code, $email, $phone_number)
    {
        $verification_code = self::where('code', $code)
            ->where('is_used', false)
            ->where('expired_at', '>', now())
            ->where(function($query) use ($email, $phone_number) {
                $query->where('email', $email)
                    ->orWhere('phone_number', $phone_number);
            })
            ->first();

        if ($verification_code) {
            $verification_code->update([
                'is_used' => true,
            ]);
            return true;
        }

        return false;
    }
}
