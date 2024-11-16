<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('target_user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('message_id')->nullable()->constrained('messages')->default(null)->onDelete('cascade');
            $table->foreignId('post_id')->nullable()->constrained('posts')->default(null)->onDelete('cascade');
            $table->foreignId('comment_id')->nullable()->constrained('post_comments')->default(null)->onDelete('cascade');
            $table->foreignId('conversation_id')->nullable()->constrained('conversations')->default(null)->onDelete('cascade');
            $table->foreignId('friend_request_id')->nullable()->constrained('friend_requests')->default(null)->onDelete('cascade');
            $table->foreignId('conversation_invitation_id')->nullable()->constrained('conversation_invitations')->default(null)->onDelete('cascade');
            $table->text('content')->nullable()->default(null);
            $table->enum('action_type', [
                'user_like_post', 'user_comment_post', 'user_share_post',
                'user_follow',
                'user_send_friend_request', 'user_accept_friend_request',
                'user_send_conversation_invitation', 'user_accept_conversation_invitation',
                'user_create_post',
                'user_send_message', 'user_recall_message', 'user_pin_message', 'user_reply_message'
            ]);
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
