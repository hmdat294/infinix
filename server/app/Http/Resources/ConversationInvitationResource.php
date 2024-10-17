<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConversationInvitationResource extends JsonResource
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
            'sender' => new UserResource($this->sender),
            'receiver' => new UserResource($this->receiver),
            'status' => $this->status,
            'conversation' => $this->conversation,
            'created_at_time' => $this->created_at->format('H:i'),
            'created_at_date' => $this->created_at->format('Y-m-d'),
            'updated_at_time' => $this->updated_at->format('H:i'),
            'updated_at_date' => $this->updated_at->format('Y-m-d'),
        ];
    }
}
