<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_interests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('project_listing_id');
            $table->unsignedBigInteger('FreelancerID');
            $table->timestamps();

            $table->foreign('project_listing_id')
                ->references('id')
                ->on('project_listings')
                ->onDelete('cascade');

            $table->foreign('FreelancerID')
                ->references('FreelancerID')
                ->on('freelancers')
                ->onDelete('cascade');

            $table->unique(['project_listing_id', 'FreelancerID']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_interests');
    }
};
