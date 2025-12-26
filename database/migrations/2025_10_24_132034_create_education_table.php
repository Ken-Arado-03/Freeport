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
        Schema::create('education', function (Blueprint $table) {
            $table->id('EducationID');
            $table->unsignedBigInteger('FreelancerID');
            $table->string('Degree');
            $table->string('Major');
            $table->string('InstitutionName');
            $table->year('GraduationYear');
            $table->decimal('GPA', 3, 2)->nullable();
            $table->timestamps();

            $table->foreign('FreelancerID')->references('FreelancerID')->on('freelancers')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('education');
    }
};
