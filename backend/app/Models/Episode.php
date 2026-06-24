<?php

namespace App\Models;

use Database\Factories\EpisodeFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Episode extends Model
{
    /** @use HasFactory<EpisodeFactory> */
    use HasFactory;
    use HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = ['name', 'done', 'index', 'serie_id', 'user_id'];

    public function serie() : BelongsTo
    {
        return $this->belongsTo(Serie::class);    
    }

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class);    
    }
}
