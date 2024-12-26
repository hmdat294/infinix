<?php

namespace App\Http\Resources;

use App\Models\FriendRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
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
        $blocked_by_user = false;
        $blocked_user = false;

        $friends = collect();
        
        $followers = collect();
        $followings = collect();

        $is_sent_friend_request = false;
        $is_followed = false;

        if ($request->user()) {

            $current_user = User::find($request->user()->id);

            $blocked_by_user = $current_user->blockedBy->contains($this->id);
            $blocked_user = $current_user->blockings->contains($this->id);

            $friendsOf =  $current_user->friendsOf ?: collect();
            $friendsOfMine =$current_user->friendsOfMine ?: collect();
            $friends = $friendsOf->concat($friendsOfMine);
            
            $followers = $this->followers;
            $followings = $this->followings;

            $friend_request = FriendRequestModel::where('sender_id', $current_user->id)
            ->where('receiver_id', $this->id)
            ->where('status', "pending")
            ->first();

            if ($friend_request) {
                $is_sent_friend_request = true;
            }

            if ($request->user()->followings->contains($this->id)) {
                $is_followed = true;
            }
        }


        return [
            'id' => $this->id,
            'username' => $this->username,
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
            'is_followed' => $is_followed,
            'is_sent_friend_request' => $is_sent_friend_request,
            'friend_count' => $friends->count(),
            'follower_count' => $followers->count(),
            'following_count' => $followings->count(),
            'online_status' => $this->online_status,
            'blocked_by_user' => $blocked_by_user,
            'blocked_user' => $blocked_user,
            'cart_id' => $this->cart ? $this->cart->id : null,
            'shop_id' => $this->shop ? $this->shop->id : null,
            'accept_stranger_message' => $this->accept_stranger_message,
        ];
    }
}
