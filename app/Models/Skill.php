<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Skill extends Model
{
    protected $table = 'skills';
    protected $primaryKey = 'SkillID';

    protected $fillable = [
        'FreelancerID',
        'SkillName',
        'ProficiencyLevel',
        'YearsOfExperience',
        'Certification',
    ];

    // Relationships
    public function freelancer(): BelongsTo
    {
        return $this->belongsTo(Freelancer::class, 'FreelancerID', 'FreelancerID');
    }
}
