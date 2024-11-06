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
        $data['target_user'] = new UserResource($this->targetUser);
        $data['message'] = new MessageResource($this->message);
        $data['post'] = new PostResource($this->post);
        $data['comment'] = new CommentResource($this->comment);
        $data['conversation'] = new ConversationResource($this->conversation);
        $data['friend_request'] = new FriendRequestResource($this->friendRequest);
        $data['conversation_invitation'] = new ConversationInvitationResource($this->conversationInvitation);
        $data['created_at'] = $this->created_at->format('Y-m-d H:i:s');
        $data['created_at_time'] = $this->created_at->format('H:i');
        $data['created_at_date'] = $this->created_at->format('Y-m-d');
        return $data;
    }
}
