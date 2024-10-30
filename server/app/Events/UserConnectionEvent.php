<?php

namespace App\Events;

use App\Http\Resources\UserResource;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Support\Facades\Log;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User as UserModel;

use function Pest\Laravel\json;

class UserConnectionEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    protected $user;
    protected $status;
    
    public function __construct($user, $status)
    {
        $this->user = $user;
        $this->status = $status;
    }

    
    public function broadcastOn()
    {
        $friend_id_array = UserModel::find($this->user->id)->friendsOf->concat(UserModel::find($this->user->id)->friendsOfMine)->pluck('id');
        $follower_id_array = UserModel::find($this->user->id)->followers->pluck('id');
        $friend_id_array = $friend_id_array->merge($follower_id_array);
        $channel_array = [];
        foreach ($friend_id_array as $friend_id) {
            $channel_array[] = new Channel('user.' . $friend_id);
        }
        return $channel_array;
    }
    
    public function broadcastWith()
    {
        return [
            'user' => new UserResource($this->user),
            'status' => $this->status
        ];
    }
}
