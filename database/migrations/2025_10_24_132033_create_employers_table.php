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
        Schema::create('employers', function (Blueprint $table) {
            $table->id('EmployerID');
            $table->string('CompanyName');
            $table->string('ContactPersonName');
            $table->string('Email')->unique();
            $table->string('PhoneNumber')->nullable();
            $table->string('CompanyLogo')->nullable();
            $table->string('CompanyWebsite')->nullable();
            $table->text('Address')->nullable();
            $table->string('IndustryType')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employers');
    }
};
