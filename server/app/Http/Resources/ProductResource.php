<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = parent::toArray($request);
        $data['shop_name'] = $this->shop->name;
        $data['shop_logo'] = $this->shop->logo;
        $data['shop_user_id'] = $this->shop->user_id;
        $data['category_name'] = $this->category->name;

        $data['images'] = $this->images ?? [];

        return $data;
    }
}
