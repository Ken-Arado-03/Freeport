<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed Freeport database tables in correct order
        $this->call([
            FreelancerSeeder::class,
            EmployerSeeder::class,
            AvailabilitySeeder::class,
            EducationSeeder::class,
            SkillSeeder::class,
            PortfolioWorkSeeder::class,
            SavedBookmarkedSeeder::class,
        ]);

        $this->command->info('Freeport database seeded successfully!');
    }
}
