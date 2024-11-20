<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $data = parent::toArray($request);
        $data['total'] = 0;

        foreach ($this->products as $product) {
            $data['total'] += $product->pivot->price * $product->pivot->quantity;
        }

        $data['products'] = ProductResource::collection($this->products);

        return $data;
    }
}
