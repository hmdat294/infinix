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
        $data = parent::toArray($request);

        $data['likes_count'] = $this->likes()->count();
        $data['comments_count'] = $this->comments()->count();
        $data['shares_count'] = $this->shares()->count();
        $data['bookmarks_count'] = $this->bookmarks()->count();

        $data['newest_comment'] =PostCommentModel::where('post_id', $this->id)->orderBy('created_at', 'desc')->first();

        return $data;
    }
}
