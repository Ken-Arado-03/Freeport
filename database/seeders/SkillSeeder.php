<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();
        
        $skillNames = [
            'Laravel', 'PHP', 'React', 'Vue.js', 'Angular', 'Node.js',
            'Python', 'Django', 'Flask', 'Java', 'Spring Boot',
            'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Sass',
            'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
            'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud',
            'UI Design', 'UX Design', 'Figma', 'Adobe XD', 'Sketch',
            'Photoshop', 'Illustrator', 'InDesign',
            'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch',
            'Data Science', 'Data Analysis', 'Pandas', 'NumPy',
            'SEO', 'Content Marketing', 'Social Media Marketing',
            'Google Analytics', 'Google Ads', 'Facebook Ads',
            'Swift', 'Kotlin', 'React Native', 'Flutter',
            'Git', 'GitHub', 'CI/CD', 'Agile', 'Scrum',
            'REST API', 'GraphQL', 'WebSockets',
            'Jest', 'Pytest', 'Unit Testing', 'Integration Testing',
            'Blockchain', 'Solidity', 'Smart Contracts',
            'WordPress', 'Shopify', 'WooCommerce',
        ];
        
        $proficiencyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
        $certifications = ['Yes', 'No'];
        
        // Get all freelancer IDs
        $freelancerIds = \App\Models\Freelancer::pluck('FreelancerID')->toArray();
        
        // Generate 3-8 skills per freelancer
        foreach ($freelancerIds as $freelancerId) {
            $numberOfSkills = rand(3, 8);
            $selectedSkills = $faker->randomElements($skillNames, $numberOfSkills);
            
            foreach ($selectedSkills as $skillName) {
                $proficiency = $faker->randomElement($proficiencyLevels);
                
                // Years of experience based on proficiency
                $yearsOfExperience = match($proficiency) {
                    'Beginner' => rand(0, 2),
                    'Intermediate' => rand(2, 4),
                    'Advanced' => rand(4, 7),
                    'Expert' => rand(7, 12),
                };
                
                \App\Models\Skill::create([
                    'FreelancerID' => $freelancerId,
                    'SkillName' => $skillName,
                    'ProficiencyLevel' => $proficiency,
                    'YearsOfExperience' => $yearsOfExperience,
                    'Certification' => $faker->randomElement($certifications),
                ]);
            }
        }
    }
}
