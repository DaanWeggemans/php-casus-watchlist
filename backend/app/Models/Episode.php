<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Episode extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = ['name', 'done', 'index', 'serie_id', 'user_id'];

    public static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->id))
                $model->id = Str::uuid();
        });
    }

    public function serie() : BelongsTo
    {
        return $this->belongsTo(Serie::class);    
    }

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class);    
    }
}
