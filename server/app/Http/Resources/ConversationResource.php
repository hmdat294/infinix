<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConversationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // $data = parent::toArray($request);
        // $data['created_at_time'] = $this->created_at->format('H:i');
        // $data['created_at_date'] = $this->created_at->format('Y-m-d');
        // $data['updated_at_time'] = $this->updated_at->format('H:i');
        // $data['updated_at_date'] = $this->updated_at->format('Y-m-d');
        // $data['messages'] = MessageResource::collection($this->messages);
        // $data['users'] = UserResource::collection($this->users);

        // return $data;
        return parent::toArray($request);
    }
}
