<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Shop;
use App\Models\User;

class ShopRequestResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = parent::toArray($request);
        $data['shop'] = new ShopResource(Shop::find($this->shop_id));
        $user = User::find($this->user_id);
        $data['user'] = [
            'id' => $user->id,
            'display_name' => $user->profile->display_name,
            'profile_photo' => $user->profile->profile_photo,
        ];

        return $data;
    }
}
