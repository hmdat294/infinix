<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $friends = $request->user()->friendsOf->concat($request->user()->friendsOfMine);
        $followers = $request->user()->followers;
        $followings = $request->user()->followings;


        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'status' => $this->status,
            'language' => $this->language,
            'theme' => $this->theme,
            'last_activity' => $this->last_activity,
            'updated_at' => $this->updated_at,
            'friends' =>new UserResource($friends),
            'followers' => new UserResource($followers),
            'followings' => new UserResource($followings),
            'profile' => new ProfileResource($this->profile),
        ];
    }
}
