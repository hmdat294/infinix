<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = parent::toArray($request);

        $data['products'] = $this->products->map(function ($product) {
            $product = new ProductResource($product);
            $product['quantity'] = $product->pivot->quantity;
            $product['voucher_discount_price'] = $product->pivot->voucher_discount_price;
            return $product;
        });
        $data['payment_method'] = $this->group->payment_method;
        $data['payment_status'] = $this->group->payment_status;
        $data['fullname'] = $this->group->fullname;
        $data['address'] = $this->group->address;
        $data['phone_number'] = $this->group->phone_number;
        $data['email'] = $this->group->email;
        $data['external_order_id'] = $this->group->external_order_id;
        $data['shop_name'] = $this->shop->name;
        $data['shop_logo'] = $this->shop->logo;

        return $data;
    }
}
