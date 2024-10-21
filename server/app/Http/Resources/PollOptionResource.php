<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PollOptionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // $data = parent::toArray($request);

        // $data['option_total_votes'] = $this->votes->count();

        // return $data;
        return parent::toArray($request);
    }
}
