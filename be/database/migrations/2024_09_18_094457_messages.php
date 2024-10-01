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
        
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('is_group')->default(false);
            $table->timestamps();
        });
        
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->text('message')->nullable();
            $table->json('images')->nullable();
            $table->integer('reply_id')->nullable();
            $table->tinyInteger('recalls')->default(0);
            $table->timestamps();
        });

        Schema::create('conversation_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversation_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->timestamps();
        });

        Schema::create('friend_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sender_id')->nullable();
            $table->foreign('sender_id')->references('id')->on('users');
            $table->unsignedBigInteger('receiver_id')->nullable();
            $table->foreign('receiver_id')->references('id')->on('users');
            $table->string('status', 100)->default('Đã gửi');
            $table->timestamps();
        });
        
        Schema::create('relationship', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users');
            $table->unsignedBigInteger('related_user_id')->nullable();
            $table->foreign('related_user_id')->references('id')->on('users');
            $table->string('relationship_type', 100)->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversations');
        Schema::dropIfExists('messages');
        Schema::dropIfExists('conversation_user');
        Schema::dropIfExists('friend_request');
        Schema::dropIfExists('relationship');
    }
};
