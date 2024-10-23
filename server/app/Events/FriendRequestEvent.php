<?php

namespace App\Events;

use App\Http\Resources\UserResource;
use App\Models\FriendRequest;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User as UserModel;
use Illuminate\Support\Facades\Log;

class FriendRequestEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    protected $sender_id;
    protected $receiver_id;
    protected $status;


    public function __construct($sender_id, $receiver_id, $status)
    {
        $this->sender_id = $sender_id;
        $this->receiver_id = $receiver_id;
        $this->status = $status;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('user.' . $this->sender_id),
            new Channel('user.' . $this->receiver_id),
        ];
    }

    public function broadcastWith(): array
    {
        Log::info($this->sender_id." - ".$this->receiver_id." - ".$this->status);
        $friend_request = FriendRequest::where('sender_id', $this->sender_id)
            ->where('receiver_id', $this->receiver_id)
            ->first();
        return [
            'id' => $friend_request->id,
            'sender' => new UserResource(UserModel::find($this->sender_id)),
            'receiver' => new UserResource(UserModel::find($this->receiver_id)),
            'status' => $this->status,
        ];
    }
}
