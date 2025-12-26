<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PortfolioWork extends Model
{
    protected $table = 'portfolio_work';
    protected $primaryKey = 'PortfolioID';

    protected $fillable = [
        'FreelancerID',
        'ProjectTitle',
        'ProjectDescription',
        'TechnologiesUsed',
        'CompletionDate',
        'ProjectURL',
        'ProjectFile',
    ];

    protected $casts = [
        'CompletionDate' => 'date',
    ];

    // Relationships
    public function freelancer(): BelongsTo
    {
        return $this->belongsTo(Freelancer::class, 'FreelancerID', 'FreelancerID');
    }
}
