<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EducationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();
        
        $degrees = [
            'Bachelor of Science',
            'Bachelor of Arts',
            'Bachelor of Engineering',
            'Bachelor of Business Administration',
            'Master of Science',
            'Master of Arts',
            'Master of Business Administration',
            'PhD',
            'Associate Degree',
        ];
        
        $majors = [
            'Computer Science',
            'Software Engineering',
            'Data Science',
            'Artificial Intelligence',
            'Information Technology',
            'Graphic Design',
            'Digital Marketing',
            'Business Administration',
            'Marketing',
            'Web Development',
            'Mobile Computing',
            'Cybersecurity',
            'UI/UX Design',
            'Game Development',
            'Network Engineering',
        ];
        
        $universities = [
            'MIT',
            'Stanford University',
            'Harvard University',
            'University of Cambridge',
            'Oxford University',
            'University of Toronto',
            'University of Sydney',
            'UC Berkeley',
            'Carnegie Mellon University',
            'Georgia Tech',
            'Parsons School of Design',
            'NYU',
            'University of Washington',
            'Imperial College London',
            'ETH Zurich',
            'Caraga State University',
            'Father Saturnino College',
            'University of the Philippines',
        ];
        
        // Get all freelancer IDs
        $freelancerIds = \App\Models\Freelancer::pluck('FreelancerID')->toArray();
        
        // Generate 1-3 education records per freelancer
        foreach ($freelancerIds as $freelancerId) {
            $numberOfDegrees = rand(1, 3);
            $lastGraduationYear = null;
            
            for ($i = 0; $i < $numberOfDegrees; $i++) {
                // Ensure progression in years
                if ($lastGraduationYear === null) {
                    $graduationYear = rand(2010, 2023);
                } else {
                    $graduationYear = $lastGraduationYear + rand(2, 4);
                    if ($graduationYear > 2024) break;
                }
                
                \App\Models\Education::create([
                    'FreelancerID' => $freelancerId,
                    'Degree' => $faker->randomElement($degrees),
                    'Major' => $faker->randomElement($majors),
                    'InstitutionName' => $faker->randomElement($universities),
                    'GraduationYear' => $graduationYear,
                    'GPA' => $faker->randomFloat(2, 2.50, 4.00),
                ]);
                
                $lastGraduationYear = $graduationYear;
            }
        }
    }
}
