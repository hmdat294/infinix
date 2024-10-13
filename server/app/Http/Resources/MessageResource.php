<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = parent::toArray($request);
        $data['conversation'] = $this->conversation;
        $data['user'] = $this->user;
        $data['reply_to_message'] = $this->replyToMessage;
        $data['medias'] = $this->medias;

        return $data;
    }
}
