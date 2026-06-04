<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Franchise extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = ['name', 'index', 'user_id'];

    public static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->id))
                $model->id = Str::uuid();
        });
    }

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function series() : HasMany
    {
        return $this->hasMany(Serie::class);
    }
}
