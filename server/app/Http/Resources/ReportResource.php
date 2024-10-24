<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = parent::toArray($request);
        $data['sender'] = new UserResource($this->sender);
        $data['user'] = new UserResource($this->user);
        $data['post'] = $this->post ? new PostResource($this->post) : collect();
        $data['comment'] = $this->comment ? new CommentResource($this->comment) : collect();
        $data['message'] = $this->message ? new MessageResource($this->message) : collect();
        return $data;
    }
}
