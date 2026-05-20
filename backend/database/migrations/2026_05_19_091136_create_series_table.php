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
        Schema::create('series', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('type');
            $table->boolean('done');
            $table->integer('index');
            $table->integer('season')->nullable();
            $table->binary('image')->nullable();
            $table->uuid('franchise_id')->index();
            $table->uuid('user_id')->index();
            $table->timestamps();
            $table->foreign('franchise_id')->references('id')->on('franchises');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('series');
    }
};
