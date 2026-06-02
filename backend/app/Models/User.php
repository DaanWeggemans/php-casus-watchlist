<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

#[Fillable(['username', 'email', 'password'])]
#[Hidden(['password'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $keyType = 'string';
    public $incrementing = false;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public static function booted()
    {
        static::creating(function ($model) {
            if (empty($model->id))
                $model->id = Str::uuid();
        });
    }

    public function franchises() : HasMany
    {
        return $this->hasMany(Franchise::class);
    }

    public function series() : HasMany
    {
        return $this->hasMany(Serie::class);
    }

    public function episodes() : HasMany
    {
        return $this->hasMany(Episode::class);
    }
}
