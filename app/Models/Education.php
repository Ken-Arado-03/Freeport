<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Education extends Model
{
    protected $table = 'education';
    protected $primaryKey = 'EducationID';

    protected $fillable = [
        'FreelancerID',
        'Degree',
        'Major',
        'InstitutionName',
        'GraduationYear',
        'GPA',
    ];

    protected $casts = [
        'GPA' => 'decimal:2',
    ];

    // Relationships
    public function freelancer(): BelongsTo
    {
        return $this->belongsTo(Freelancer::class, 'FreelancerID', 'FreelancerID');
    }
}
