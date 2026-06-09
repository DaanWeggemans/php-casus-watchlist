<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Feed extends Model
{
    use HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = ['serie_id', 'user_id'];

    public function serie() : BelongsTo
    {
        return $this->belongsTo(Serie::class);
    }

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
