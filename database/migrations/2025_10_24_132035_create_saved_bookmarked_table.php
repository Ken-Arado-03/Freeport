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
        Schema::create('saved_bookmarked', function (Blueprint $table) {
            $table->id('SavedID');
            $table->unsignedBigInteger('FreelancerID');
            $table->unsignedBigInteger('EmployerID');
            $table->timestamp('SavedDate')->useCurrent();
            $table->timestamps();

            $table->foreign('FreelancerID')->references('FreelancerID')->on('freelancers')->onDelete('cascade');
            $table->foreign('EmployerID')->references('EmployerID')->on('employers')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saved_bookmarked');
    }
};
