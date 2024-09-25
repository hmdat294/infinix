<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class ConversationModel extends Model
{
    use HasFactory;
    protected $table = 'conversations';
    public function scopeConversationByUserId($query, $sender_id, $receiver_id)
    {
        return $query->join('conversation_user', 'conversation_user.conversation_id', '=', 'conversations.id')
            ->where('conversation_user.user_id', $sender_id)
            ->orWhere('conversation_user.user_id', $receiver_id)
            ->groupBy('conversations.id')
            ->havingRaw('count(conversation_user.user_id) = 2')
            ->select('conversations.id');
    }

    public function scopeCreateConversation($query, $user_id_array)
    {
        $conversation = DB::table('conversations')->insertGetId([]);
        foreach ($user_id_array as $user_id) {
            DB::table('conversation_user')->insert([
                'conversation_id' => $conversation,
                'user_id' => $user_id
            ]);
        }
        return $conversation;
    }
}
