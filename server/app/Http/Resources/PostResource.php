<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'content' => $this->content,
            'post_type' => $this->post_type,
            'created_at' =>  Carbon::parse($this->created_at)->format('Y-m-d H:i:s'),
            'user' => new UserResource($this->user),
            'comments' => CommentResource::collection($this->comments),
            'medias' => PostMediaResource::collection($this->medias),

        ];

        if ($this->poll) {
            $data['poll'] = new PollResource($this->poll);
        }

        return $data;
    }
}
