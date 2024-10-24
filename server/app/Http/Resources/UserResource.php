<?php

namespace App\Http\Resources;

use App\Models\FriendRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;
use App\Models\FriendRequest as FriendRequestModel;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        
        $friends = collect();
        
        $followers = collect();
        $followings = collect();

        
        $can_send_friend_request = null;

        if ($request->user()) {
            $friendsOf =  $request->user()->friendsOf ?: collect();
            $friendsOfMine =$request->user()->friendsOfMine ?: collect();
            $friends = $friendsOf->concat($friendsOfMine);
            
            $followers = $this->followers;
            $followings = $this->followings;

            if($friends->contains($this->id)) {
                $can_send_friend_request = false;
            } else {
                $pendingFriendRequests = $request->user()->friendRequest()->where('status', 'pending')->pluck('receiver_id');
                $can_send_friend_request = !$pendingFriendRequests->contains($this->id);
            }


        }


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
            'can_send_friend_request' => $can_send_friend_request
        ];
    }
}
