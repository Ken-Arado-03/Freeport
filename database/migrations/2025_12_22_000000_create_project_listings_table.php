<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_listings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('EmployerID');
            $table->string('title');
            $table->text('description');
            $table->decimal('budget', 10, 2)->nullable();
            $table->string('duration')->nullable();
            $table->string('experience_needed')->nullable();
            $table->json('skills_required')->nullable();
            $table->unsignedInteger('interest_count')->default(0);
            $table->enum('status', ['open', 'in_progress', 'completed', 'closed'])->default('open');
            $table->timestamps();

            $table->foreign('EmployerID')
                ->references('EmployerID')
                ->on('employers')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_listings');
    }
};
