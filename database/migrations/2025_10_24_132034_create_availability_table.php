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
        Schema::create('availability', function (Blueprint $table) {
            $table->id('AvailabilityID');
            $table->unsignedBigInteger('FreelancerID');
            $table->integer('CurrentProjectsCount')->default(0);
            $table->string('ActivityStatus')->default('Active');
            $table->date('NextAvailabilityDate')->nullable();
            $table->integer('WeeklyHoursAvailable')->nullable();
            $table->timestamps();

            $table->foreign('FreelancerID')->references('FreelancerID')->on('freelancers')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('availability');
    }
};
