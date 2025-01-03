<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShopResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = parent::toArray($request);
        $data['total_revenue'] = $this->total_revenue;
        $data['average_rating'] = $this->products->avg('average_rating');
        $data['total_products_sold'] = $this->total_products_sold;
        $data['categories'] = CategoryResource::collection($this->categories);
        $data['product_count'] = $this->products->count() ?? 0;
        $data['category_count'] = $this->categories->count() ?? 0;
        $data['voucher_count'] = $this->vouchers->count() ?? 0;

        return $data;
    }
}
