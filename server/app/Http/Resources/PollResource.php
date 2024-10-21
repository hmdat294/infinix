<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PollResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // $data = [
        //     'id' => $this->id,
        //     'end_at' => $this->end_at,
        //     'options' => PollOptionResource::collection($this->options),
        // ];

        // $poll_total_votes = 0;
        // foreach ($this->options as $option) {
        //     $poll_total_votes += $option->votes->count();
        // }

        // $data['total_votes'] = $poll_total_votes;

        // return $data;
        return parent::toArray($request);
    }
}
