<?php

namespace App\Http\Resources;

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

        if ($request->user()) {
            if (VoucherUser::where('user_id', $request->user()->id)->where('voucher_id', $this->id)->where('is_saved', true)->exists()) {
                $is_saved = true;
            }
        }


        $data = parent::toArray($request);
        $data['apply_to_products'] = $this->products->pluck('id')->toArray();
        $data['is_saved'] = $is_saved;


        return $data;
    }
}
