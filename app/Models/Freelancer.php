<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Freelancer extends Model
{
    protected $table = 'freelancers';
    protected $primaryKey = 'FreelancerID';

    protected $fillable = [
        'FirstName',
        'LastName',
        'Email',
        'PhoneNumber',
        'ProfilePicture',
        'Bio',
        'Location',
        'AccountCreatedDate',
    ];

    protected $casts = [
        'AccountCreatedDate' => 'datetime',
    ];

    // Relationships
    public function availability(): HasOne
    {
        return $this->hasOne(Availability::class, 'FreelancerID', 'FreelancerID');
    }

    public function education(): HasMany
    {
        return $this->hasMany(Education::class, 'FreelancerID', 'FreelancerID');
    }

    public function portfolioWork(): HasMany
    {
        return $this->hasMany(PortfolioWork::class, 'FreelancerID', 'FreelancerID');
    }

    public function skills(): HasMany
    {
        return $this->hasMany(Skill::class, 'FreelancerID', 'FreelancerID');
    }

    public function savedBy(): HasMany
    {
        return $this->hasMany(SavedBookmarked::class, 'FreelancerID', 'FreelancerID');
    }
}
