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
        Schema::create('disabled_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('target_user_id')->constrained('users')->nullable()->default(null);
            $table->foreignId('conversation_id')->constrained('conversations')->nullable()->default(null);
            $table->foreignId('post_id')->constrained('posts')->nullable()->default(null);
            $table->enum('type', ['conversation', 'post', 'user']);
            $table->timestamp('enabled_at')->nullable()->default(null);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('disabled_notifications');
    }
};
