<?php

namespace App\Models;

use Database\Factories\SerieFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Serie extends Model
{
    /** @use HasFactory<SerieFactory> */
    use HasFactory;
    use HasUuids;
    
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = ['name', 'type', 'done', 'index', 'season', 'image', 'franchise_id', 'user_id'];

    public function franchise() : BelongsTo
    {
        return $this->belongsTo(Franchise::class);
    }

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function episodes() : HasMany
    {
        return $this->hasMany(Episode::class);
    }

    public function feeds() : HasMany
    {
        return $this->hasMany(Feed::class);
    }
}
