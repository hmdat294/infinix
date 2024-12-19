<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = parent::toArray($request);
        $data['user']['id'] = $this->user->id;
        $data['user']['display_name'] = $this->user->profile->display_name;
        $data['user']['profile_photo'] = $this->user->profile->profile_photo;

        if ($this->targetUser) {
            $data['target_user']['id'] = $this->targetUser->id;
            $data['target_user']['display_name'] = $this->targetUser->profile->display_name;
            $data['target_user']['profile_photo'] = $this->targetUser->profile->profile_photo;
        }
        if ($this->message) {
            $data['message']['id'] = $this->message->id;
            $data['message']['content'] = $this->message->content;
            $data['message']['conversation_id'] = $this->message->conversation_id;
        }

        if ($this->post) {
            $data['post']['id'] = $this->post->id;
            $data['post']['user_id'] = $this->post->user_id;
            $data['post']['user_id'] = $this->post->user->id;
            $data['post']['user_display_name'] = $this->post->user->profile->display_name;
            $data['post']['user_profile_photo'] = $this->post->user->profile->profile_photo;
            $data['post']['content'] = $this->post->content;
        }
        if ($this->comment) {
            $data['comment']['id'] = $this->comment->id;
            $data['comment']['content'] = $this->comment->content;
            $data['comment']['user_id'] = $this->comment->user_id;
            $data['comment']['user_id'] = $this->comment->user->id;
            $data['comment']['user_display_name'] = $this->comment->user->profile->display_name;
            $data['comment']['user_profile_photo'] = $this->comment->user->profile->profile_photo;
            $data['comment']['post_id'] = $this->comment->post_id;
        }

        if ($this->conversation) {
            $data['conversation']['id'] = $this->conversation->id;
            $data['conversation']['user_id'] = $this->conversation->user_id;
            $data['conversation']['name'] = $this->conversation->name;
            $data['conversation']['image'] = $this->conversation->image;
        }

        if ($this->friendRequest) {
            $data['friend_request']['id'] = $this->friendRequest->content;
            $data['friend_request']['sender_id'] = $this->friendRequest->sender_id;
            $data['friend_request']['sender_display_name'] = $this->friendRequest->sender->profile->display_name;
            $data['friend_request']['receiver_id'] = $this->friendRequest->receiver_id;
            $data['friend_request']['receiver_display_name'] = $this->friendRequest->receiver->profile->display_name;
            $data['friend_request']['status'] = $this->friendRequest->status;
        }

        if ($this->conversation_invitation) {
            $data['conversation_invitation']['id'] = $this->conversationInvitation->id;
            $data['conversation_invitation']['sender_id'] = $this->conversationInvitation->sender_id;
            $data['conversation_invitation']['sender_display_name'] = $this->conversationInvitation->sender->profile->display_name;
            $data['conversation_invitation']['receiver_id'] = $this->conversationInvitation->receiver_id;
            $data['conversation_invitation']['receiver_display_name'] = $this->conversationInvitation->receiver->profile->display_name;
            $data['conversation_invitation']['conversation_id'] = $this->conversationInvitation->conversation_id;
            $data['conversation_invitation']['conversation_name'] = $this->conversationInvitation->conversation->name;
        }

        if ($this->shop) {
            $data['shop']['id'] = $this->shop->id;
            $data['shop']['user_id'] = $this->shop->user_id;
            $data['shop']['name'] = $this->shop->name;
            $data['shop']['logo'] = $this->shop->logo;
            $data['shop']['is_active'] = $this->shop->is_active;
            $data['shop']['user_display_name'] = $this->shop->user->profile->display_name;
        }
        $data['created_at'] = $this->created_at->format('Y-m-d H:i:s');
        $data['created_at_time'] = $this->created_at->format('H:i');
        $data['created_at_date'] = $this->created_at->format('Y-m-d');
        return $data;
    }
}
