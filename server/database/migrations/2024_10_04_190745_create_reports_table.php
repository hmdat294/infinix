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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('post_id')->nullable()->default(null)->constrained('posts');
            $table->foreignId('comment_id')->nullable()->default(null)->constrained('post_comments');
            $table->foreignId('message_id')->nullable()->default(null)->constrained('messages');
            $table->text('content')->nullable()->default(null);
            $table->enum('type', ['user', 'post', 'comment', 'message'])->default('post');
            $table->enum('status', ['pending', 'resolved'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};