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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->foreignId('category_id')->constrained()->onDelete('set null');
            $table->string('description')->nullable()->default(null);
            $table->string('image')->nullable()->default(null);
            $table->integer('price');
            $table->decimal('discount', 5, 2)->default(0);
            $table->integer('stock')->default(-1);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shop_products');
    }
};
