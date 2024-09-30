<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class messageResource extends JsonResource
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
            'conversation_id' => $this->conversation_id,
            'user_id' => $this->user_id,
            'message' => $this->message,
            'images' => json_decode($this->images),
            'reply_id' => $this->reply_id,
            'recalls' => $this->recalls,
            'date' => $this->created_at->format('d/m/Y'),
            'time' => $this->created_at->format('H:i'),
        ];
    }
}
