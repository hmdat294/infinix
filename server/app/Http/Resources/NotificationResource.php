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
        $data['user'] = new UserResource($this->user);
        $data['target_user'] = new UserResource($this->targetUser) ?? collect();
        $data['message'] = new MessageResource($this->message) ?? collect();
        $data['post'] = new PostResource($this->post) ?? collect();
        $data['comment'] = new CommentResource($this->comment) ?? collect();
        $data['conversation'] = new ConversationResource($this->conversation) ?? collect();
        $data['friend_request'] = new FriendRequestResource($this->friendRequest) ?? collect();
        $data['conversation_invitation'] = new ConversationInvitationResource($this->conversationInvitation) ?? collect();
        $data['created_at'] = $this->created_at->format('Y-m-d H:i:s');
        $data['created_at_time'] = $this->created_at->format('H:i');
        $data['created_at_date'] = $this->created_at->format('Y-m-d');
        return $data;
    }
}
