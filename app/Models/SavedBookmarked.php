<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SavedBookmarked extends Model
{
    protected $table = 'saved_bookmarked';
    protected $primaryKey = 'SavedID';

    protected $fillable = [
        'FreelancerID',
        'EmployerID',
        'SavedDate',
    ];

    protected $casts = [
        'SavedDate' => 'datetime',
    ];

    // Relationships
    public function freelancer(): BelongsTo
    {
        return $this->belongsTo(Freelancer::class, 'FreelancerID', 'FreelancerID');
    }

    public function employer(): BelongsTo
    {
        return $this->belongsTo(Employer::class, 'EmployerID', 'EmployerID');
    }
}
