<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = parent::toArray($request);
        $data['user']['display_name'] = $this->user->profile->display_name;
        $data['user']['profile_photo'] = $this->user->profile->profile_photo;

        return $data;
    }
}
