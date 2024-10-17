<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'post_id' => $this->post_id,
            'user_id' => $this->user_id,
            'content' => $this->content,
            'created_at_time' => $this->created_at->format('H:i'),
            'created_at_date' => $this->created_at->format('Y-m-d'),
            'updated_at_time' => $this->updated_at->format('H:i'),
            'updated_at_date' => $this->updated_at->format('Y-m-d'),
        ];
    }
}
