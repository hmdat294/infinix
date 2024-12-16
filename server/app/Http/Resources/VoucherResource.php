<?php

namespace App\Http\Resources;

use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\VoucherUser;

class VoucherResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $is_saved = false;
        $is_used = false;
        $use_count = 0;

        if ($request->user()) {
            if (VoucherUser::where('user_id', $request->user()->id)->where('voucher_id', $this->id)->where('is_saved', true)->exists()) {
                $is_saved = true;
            }

            $use_count = VoucherUser::where('user_id', $request->user()->id)->where('voucher_id', $this->id)->first()->use_count ?? 0;
            $is_used = VoucherUser::where('user_id', $request->user()->id)->where('voucher_id', $this->id)->where('is_used', true)->exists();
        }


        $data = parent::toArray($request);
        $data['apply_to_products'] = $this->products->pluck('id')->toArray();
        $data['is_saved'] = $is_saved;
        $data['is_used'] = $is_used;
        $data['use_count'] = $use_count;


        return $data;
    }
}
