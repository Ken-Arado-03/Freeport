<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FreelancerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();
        
        $professions = [
            'Full-stack Developer',
            'UI/UX Designer',
            'Data Scientist',
            'Digital Marketing Specialist',
            'Mobile App Developer',
            'Backend Developer',
            'Frontend Developer',
            'DevOps Engineer',
            'Graphic Designer',
            'Content Writer',
            'SEO Specialist',
            'Product Manager',
            'Business Analyst',
            'Blockchain Developer',
            'AI/ML Engineer',
        ];

        // Generate 100 random freelancers
        for ($i = 1; $i <= 100; $i++) {
            $firstName = $faker->firstName();
            $lastName = $faker->lastName();
            
            \App\Models\Freelancer::create([
                'FirstName' => $firstName,
                'LastName' => $lastName,
                'Email' => strtolower($firstName . '.' . $lastName . rand(1, 999) . '@' . $faker->safeEmailDomain()),
                'PhoneNumber' => $faker->e164PhoneNumber(),
                'ProfilePicture' => 'profiles/' . strtolower($firstName . '_' . $lastName) . '.jpg',
                'Bio' => $faker->randomElement($professions) . ' with ' . rand(1, 10) . '+ years of experience in ' . $faker->words(rand(3, 6), true) . '.',
                'Location' => $faker->city() . ', ' . $faker->country(),
                'AccountCreatedDate' => $faker->dateTimeBetween('-2 years', 'now'),
            ]);
        }
    }
}
