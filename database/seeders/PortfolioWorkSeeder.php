<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PortfolioWorkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();
        
        $projectTypes = [
            'E-Commerce Platform',
            'Task Management System',
            'Social Media Platform',
            'Mobile Banking App',
            'Fitness Tracking App',
            'Food Delivery App',
            'Real Estate Platform',
            'Educational Platform',
            'Healthcare Management System',
            'Inventory Management System',
            'CRM System',
            'Analytics Dashboard',
            'Booking System',
            'Chat Application',
            'Portfolio Website',
            'Blog Platform',
            'API Development',
            'Machine Learning Model',
            'Data Visualization Tool',
            'Marketing Campaign',
        ];
        
        $techStacks = [
            ['Laravel', 'Vue.js', 'MySQL', 'Redis'],
            ['React', 'Node.js', 'MongoDB', 'Express'],
            ['Python', 'Django', 'PostgreSQL', 'Celery'],
            ['Angular', 'Spring Boot', 'MySQL', 'Kafka'],
            ['React Native', 'Firebase', 'Google Maps API'],
            ['Flutter', 'Firebase', 'SQLite'],
            ['Figma', 'Adobe XD', 'Principle'],
            ['Python', 'TensorFlow', 'Pandas', 'Scikit-learn'],
            ['Vue.js', 'Express', 'MongoDB', 'Socket.io'],
            ['WordPress', 'WooCommerce', 'PHP', 'MySQL'],
            ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
            ['Laravel', 'React', 'PostgreSQL', 'Docker'],
        ];
        
        // Get all freelancer IDs
        $freelancerIds = \App\Models\Freelancer::pluck('FreelancerID')->toArray();
        
        // Generate 1-5 portfolio items per freelancer
        foreach ($freelancerIds as $freelancerId) {
            $numberOfProjects = rand(1, 5);
            
            for ($i = 0; $i < $numberOfProjects; $i++) {
                $projectType = $faker->randomElement($projectTypes);
                $techStack = $faker->randomElement($techStacks);
                
                \App\Models\PortfolioWork::create([
                    'FreelancerID' => $freelancerId,
                    'ProjectTitle' => $projectType,
                    'ProjectDescription' => $faker->paragraph(rand(2, 4)) . ' ' . $faker->sentence(),
                    'TechnologiesUsed' => implode(', ', $techStack),
                    'CompletionDate' => $faker->dateTimeBetween('-3 years', 'now')->format('Y-m-d'),
                    'ProjectURL' => $faker->randomElement([
                        'https://demo-' . strtolower(str_replace(' ', '-', $projectType)) . '.example.com',
                        'https://github.com/' . $faker->userName() . '/' . $faker->slug(2),
                        'https://behance.net/' . $faker->slug(2),
                        'https://dribbble.com/' . $faker->slug(2),
                    ]),
                    'ProjectFile' => 'portfolio/' . $faker->slug(3) . '.' . $faker->randomElement(['pdf', 'zip', 'png', 'jpg']),
                ]);
            }
        }
    }
}
