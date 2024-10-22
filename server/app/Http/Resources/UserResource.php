<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $friendsOf = $this->friendsOf ?: collect();
        $friendsOfMine = $this->friendsOfMine ?: collect();
        $friends = $friendsOf->concat($friendsOfMine);
        
        $followers = $this->followers;
        $followings = $this->followings;


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
            'friends' => $friends,
            'followers' => $followers,
            'followings' => $followings,
            'profile' => new ProfileResource($this->profile),
            'permissions' => $this->permissions,
            'is_friend' => $friends->contains($this->id),
        ];
    }
}
