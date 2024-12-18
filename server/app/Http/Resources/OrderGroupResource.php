<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderGroupResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = parent::toArray($request);
        $data['applied_voucher'] = new VoucherResource($this->voucher);
        $data['orders'] = OrderResource::collection($this->orders);
        $data['can_refund'] = $this->payment_status === 'paid' && $this->orders()->where('status', '!=', 'pending')->doesntExist();
        $data['can_cancel'] = $this->orders()->where('status', '!=', 'pending')->doesntExist();

        return $data;
    }
}
