<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Followed extends Model
{
    use HasUuids;

    protected $table = "followed";

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = ['followed_user_id', 'user_id'];

    public function followed_user() : BelongsTo
    {
        return $this->belongsTo(User::class, 'followed_user_id');
    }

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
