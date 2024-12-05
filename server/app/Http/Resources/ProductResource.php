<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Order;
use App\Models\User;
use App\Models\Review;
use Illuminate\Support\Facades\Log;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        
        $canReview = false;

        if ($request->user())
        {
            $user_id = $request->user()->id;

            $latestOrder = Order::whereHas('orderDetails', function($query) {
                $query->where('product_id', $this->id);
            })
            ->where('user_id', $user_id)
            ->orderBy('created_at', 'desc')
            ->first();

            Log::info('lastest order: ' . $latestOrder);
    
            $latestReview = Review::where('product_id', $this->id)
                ->where('user_id', $user_id)
                ->orderBy('created_at', 'desc')
                ->first();
            Log::info('lastest review' . $latestReview);

            if ($latestOrder)
            {
                if ($latestReview)
                {
                    $canReview = $latestOrder->created_at > $latestReview->created_at;
                } else {
                    $canReview = true;
                }
            }
        }

        $data = parent::toArray($request);
        $data['total_sold'] = $this->total_sold;
        $data['can_review'] = $canReview;
        $data['average_rating'] = $this->average_rating;
        $data['shop_name'] = $this->shop->name;
        $data['shop_logo'] = $this->shop->logo;
        $data['shop_description'] = $this->shop->description;
        $data['category_name'] = $this->category->name;
        $data['images'] = $this->images ?? [];

        return $data;
    }
}
