<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employer extends Model
{
    protected $table = 'employers';
    protected $primaryKey = 'EmployerID';

    protected $fillable = [
        'CompanyName',
        'ContactPersonName',
        'Email',
        'PhoneNumber',
        'CompanyLogo',
        'CompanyWebsite',
        'Address',
        'IndustryType',
        'CompanyDescription',
        'CompanySize',
        'Founded',
        'TalentHeadline',
        'TalentAreas',
        'TalentWhyUs',
    ];

    // Relationships
    public function savedFreelancers(): HasMany
    {
        return $this->hasMany(SavedBookmarked::class, 'EmployerID', 'EmployerID');
    }
}
