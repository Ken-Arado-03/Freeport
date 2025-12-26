<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Availability extends Model
{
    protected $table = 'availability';
    protected $primaryKey = 'AvailabilityID';

    protected $fillable = [
        'FreelancerID',
        'CurrentProjectsCount',
        'ActivityStatus',
        'NextAvailabilityDate',
        'WeeklyHoursAvailable',
    ];

    protected $casts = [
        'NextAvailabilityDate' => 'date',
    ];

    // Relationships
    public function freelancer(): BelongsTo
    {
        return $this->belongsTo(Freelancer::class, 'FreelancerID', 'FreelancerID');
    }
}
