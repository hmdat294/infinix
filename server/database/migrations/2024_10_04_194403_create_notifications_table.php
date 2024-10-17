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
            $table->foreignId('message_id')->nullable()->constrained('messages')->default(null);
            $table->foreignId('post_id')->nullable()->constrained('posts')->default(null);
            $table->text('content')->nullable()->default(null);
            $table->enum('type', ['message', 'post', 'user']);
            $table->enum('action_type', ['post_like', 'post_comment', 'post_share', 'user_follow', 'user_send_friend_request', 'user_accept_friend_request', 'user_create_post', 'send_message', 'reply_message']);
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
