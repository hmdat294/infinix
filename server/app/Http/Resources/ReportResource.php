<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        $data = parent::toArray($request);
        $data['sender'] = new UserResource($this->sender);
        $data['user'] = new UserResource($this->user);
        $data['post'] = $this->post ? new PostResource($this->post) : collect();
        $data['comment'] = $this->comment ? new CommentResource($this->comment) : collect();
        $data['message'] = $this->message ? new MessageResource($this->message) : collect();
        $data['created_at_time'] = $this->created_at->format('H:i');
        $data['created_at_date'] = $this->created_at->format('Y-m-d');
        $data['updated_at_time'] = $this->updated_at->format('H:i');
        $data['updated_at_date'] = $this->updated_at->format('Y-m-d');
        return $data;
    }
}
