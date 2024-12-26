<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

use function Pest\Laravel\json;

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
        $total = 0;

        foreach ($this->products as $product) {
            $total += $product->pivot->price * $product->pivot->quantity;
        }

        $data['total'] = $total;

        $data['products'] = ProductResource::collection($this->products);

        return $data;
    }
}
