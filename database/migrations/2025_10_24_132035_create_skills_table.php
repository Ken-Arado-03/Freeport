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
        Schema::create('skills', function (Blueprint $table) {
            $table->id('SkillID');
            $table->unsignedBigInteger('FreelancerID');
            $table->string('SkillName');
            $table->string('ProficiencyLevel')->nullable();
            $table->integer('YearsOfExperience')->nullable();
            $table->enum('Certification', ['Yes', 'No'])->default('No');
            $table->timestamps();

            $table->foreign('FreelancerID')->references('FreelancerID')->on('freelancers')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('skills');
    }
};
