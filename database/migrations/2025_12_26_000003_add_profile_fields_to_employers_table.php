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
        Schema::table('employers', function (Blueprint $table) {
            $table->text('CompanyDescription')->nullable()->after('IndustryType');
            $table->string('CompanySize')->nullable()->after('CompanyDescription');
            $table->string('Founded')->nullable()->after('CompanySize');
            $table->string('TalentHeadline')->nullable()->after('Founded');
            $table->text('TalentAreas')->nullable()->after('TalentHeadline');
            $table->text('TalentWhyUs')->nullable()->after('TalentAreas');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employers', function (Blueprint $table) {
            $table->dropColumn([
                'CompanyDescription',
                'CompanySize',
                'Founded',
                'TalentHeadline',
                'TalentAreas',
                'TalentWhyUs',
            ]);
        });
    }
};
