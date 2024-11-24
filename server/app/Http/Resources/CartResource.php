<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;

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

        Log::info($this->products);

        foreach ($this->products as $product) {
            $total += $product->pivot->price * $product->pivot->quantity;
            Log::info($product->pivot->price);
            Log::info($product->pivot->quantity);
            Log::info($total);
        }

        $data['total'] = $total;

        $data['products'] = ProductResource::collection($this->products);
        Log::info( json_encode($data['products']) );

        return $data;
    }
}
