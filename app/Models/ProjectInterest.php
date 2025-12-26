<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectInterest extends Model
{
    protected $table = 'project_interests';

    protected $fillable = [
        'project_listing_id',
        'FreelancerID',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(ProjectListing::class, 'project_listing_id', 'id');
    }

    public function freelancer(): BelongsTo
    {
        return $this->belongsTo(Freelancer::class, 'FreelancerID', 'FreelancerID');
    }
}
