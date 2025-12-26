<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SavedBookmarkedSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();
        
        // Get all freelancer and employer IDs
        $freelancerIds = \App\Models\Freelancer::pluck('FreelancerID')->toArray();
        $employerIds = \App\Models\Employer::pluck('EmployerID')->toArray();
        
        // Generate 10-30 random saved/bookmarked combinations
        $numberOfBookmarks = rand(10, 30);
        $createdCombinations = [];
        
        for ($i = 0; $i < $numberOfBookmarks; $i++) {
            // Ensure unique combinations
            do {
                $freelancerId = $faker->randomElement($freelancerIds);
                $employerId = $faker->randomElement($employerIds);
                $combination = $freelancerId . '-' . $employerId;
            } while (in_array($combination, $createdCombinations));
            
            $createdCombinations[] = $combination;
            
            \App\Models\SavedBookmarked::create([
                'FreelancerID' => $freelancerId,
                'EmployerID' => $employerId,
                'SavedDate' => $faker->dateTimeBetween('-90 days', 'now'),
            ]);
        }
    }
}
