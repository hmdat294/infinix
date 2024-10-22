<?php

namespace App\Http\Resources;

use App\Models\PostComment as PostCommentModel;
use App\Models\Profile as ProfileModel;
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
            'created_at_time' => $this->created_at->format('H:i'),
            'created_at_date' => $this->created_at->format('Y-m-d'),
            'updated_at_time' => $this->updated_at->format('H:i'),
            'updated_at_date' => $this->updated_at->format('Y-m-d'),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            'profile' => new ProfileResource($this->user->profile),
            'medias' => PostMediaResource::collection($this->medias),

            "comments_count" => $this->comments->count(),
            "likes_count" => $this->likes->count(),
            "shares_count" => $this->shares->count(),
        ];

        if ($request->user())
        {
            

            $data["liked"] = $this->likes->contains('user_id', $request->user()->id);
            $data["shared"] = $this->shares->contains('user_id', $request->user()->id);
            $data["commented"] = $this->comments->contains('user_id', $request->user()->id);
        }

        if ($this->poll) {
            $data['poll'] = new PollResource($this->poll);
        }

        return $data;
    }
}
