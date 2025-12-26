<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AvailabilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();
        $statuses = ['Available', 'Active', 'Busy', 'Inactive'];
        
        // Get all freelancer IDs
        $freelancerIds = \App\Models\Freelancer::pluck('FreelancerID')->toArray();
        
        // Generate availability for each freelancer
        foreach ($freelancerIds as $freelancerId) {
            $status = $faker->randomElement($statuses);
            $projectsCount = rand(0, 5);
            
            // Determine availability based on status
            $daysUntilAvailable = match($status) {
                'Available' => 0,
                'Active' => rand(5, 20),
                'Busy' => rand(20, 60),
                'Inactive' => rand(60, 180),
            };
            
            // Weekly hours based on current workload
            $weeklyHours = match($status) {
                'Available' => rand(30, 40),
                'Active' => rand(15, 30),
                'Busy' => rand(5, 15),
                'Inactive' => rand(0, 10),
            };
            
            \App\Models\Availability::create([
                'FreelancerID' => $freelancerId,
                'CurrentProjectsCount' => $projectsCount,
                'ActivityStatus' => $status,
                'NextAvailabilityDate' => now()->addDays($daysUntilAvailable),
                'WeeklyHoursAvailable' => $weeklyHours,
            ]);
        }
    }
}
