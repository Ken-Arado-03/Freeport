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
        Schema::create('portfolio_work', function (Blueprint $table) {
            $table->id('PortfolioID');
            $table->unsignedBigInteger('FreelancerID');
            $table->string('ProjectTitle');
            $table->text('ProjectDescription')->nullable();
            $table->text('TechnologiesUsed')->nullable();
            $table->date('CompletionDate')->nullable();
            $table->string('ProjectURL')->nullable();
            $table->string('ProjectFile')->nullable();
            $table->timestamps();

            $table->foreign('FreelancerID')->references('FreelancerID')->on('freelancers')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('portfolio_work');
    }
};
