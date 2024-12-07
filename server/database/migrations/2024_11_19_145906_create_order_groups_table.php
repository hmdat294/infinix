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
        Schema::create('order_groups', function (Blueprint $table) {
            $table->id();
            $table->string('external_order_id')->default('');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('payment_method');
            $table->string('payment_status')->default('pending');
            $table->string('fullname');
            $table->string('address');
            $table->string('phone_number');
            $table->string('email');
            $table->integer('voucher_discount_price');
            $table->integer('total')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_groups');
    }
};
