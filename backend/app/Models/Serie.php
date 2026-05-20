<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Serie extends Model
{
    protected $table = "series";

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = ['name', 'type', 'done', 'index', 'season', 'image', 'franchise_id', 'user_id'];

    public static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->id))
                $model->id = Str::uuid();
        });
    }
}
