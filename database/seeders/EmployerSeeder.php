<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EmployerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();
        
        $industries = [
            'Technology',
            'Healthcare',
            'Finance',
            'E-commerce',
            'Education',
            'Real Estate',
            'Manufacturing',
            'Retail',
            'Marketing & Advertising',
            'Consulting',
            'Media & Entertainment',
            'Transportation',
            'Food & Beverage',
            'Telecommunications',
            'Energy',
        ];
        
        // Generate 100 random employers
        for ($i = 1; $i <= 100; $i++) {
            $companyName = $faker->company();
            
            \App\Models\Employer::create([
                'CompanyName' => $companyName,
                'ContactPersonName' => $faker->name(),
                'Email' => strtolower(str_replace(' ', '', $companyName)) . rand(1, 999) . '@' . $faker->safeEmailDomain(),
                'PhoneNumber' => $faker->e164PhoneNumber(),
                'CompanyLogo' => 'logos/' . strtolower(str_replace(' ', '_', $companyName)) . '.png',
                'CompanyWebsite' => 'https://www.' . strtolower(str_replace(' ', '', $companyName)) . '.com',
                'Address' => $faker->streetAddress() . ', ' . $faker->city() . ', ' . $faker->state() . ' ' . $faker->postcode(),
                'IndustryType' => $faker->randomElement($industries),
            ]);
        }
    }
}
