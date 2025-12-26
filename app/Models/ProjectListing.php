<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectListing extends Model
{
    protected $table = 'project_listings';

    protected $fillable = [
        'EmployerID',
        'title',
        'description',
        'budget',
        'duration',
        'job_type',
        'experience_needed',
        'skills_required',
        'interest_count',
        'status',
    ];

    protected $casts = [
        'skills_required' => 'array',
        'budget' => 'decimal:2',
    ];

    public function employer(): BelongsTo
    {
        return $this->belongsTo(Employer::class, 'EmployerID', 'EmployerID');
    }

    public function interests(): HasMany
    {
        return $this->hasMany(ProjectInterest::class, 'project_listing_id', 'id');
    }
}
