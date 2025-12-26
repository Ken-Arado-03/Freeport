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
        Schema::create('freelancers', function (Blueprint $table) {
            $table->id('FreelancerID');
            $table->string('FirstName');
            $table->string('LastName');
            $table->string('Email')->unique();
            $table->string('PhoneNumber')->nullable();
            $table->string('ProfilePicture')->nullable();
            $table->text('Bio')->nullable();
            $table->string('Location')->nullable();
            $table->timestamp('AccountCreatedDate')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('freelancers');
    }
};
