<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User as UserModel;
use Illuminate\Support\Facades\Log;

class UserSendMessageEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    protected $user_id;
    protected $message_id;
    protected $content;


    public function __construct($user_id, $message_id, $content)
    {
        $this->user_id = $user_id;
        $this->message_id = $message_id;
        $this->content = $content;
    }


    public function broadcastOn(): array
    {
        $recipient_id_array = UserModel::find($this->user_id)->friendsOf->concat(UserModel::find($this->user_id)->friendsOfMine)->pluck('id');
        $recipient_id_array[] = $this->user_id;
        $recipient_id_array = $recipient_id_array->concat(UserModel::find($this->user_id)->followers->pluck('id'));
        
        $channel_array = [];
        foreach ($recipient_id_array as $recipient_id) {
            $channel_array[] = new PrivateChannel('user.' . $recipient_id);
        }
        return $channel_array;
    }


}
