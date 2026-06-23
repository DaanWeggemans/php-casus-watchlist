<?php

namespace App\Http\Resources\user;

use App\Models\Followed;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FollowedUserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $isFollowed = $request->user() != null ? $request->user()->followed()
            ->where('followed_user_id', $this->id)
            ->exists() : false;

        return [
            'id' => $this->id,
            'username' => $this->username,
            'email' => $this->email,
            'is_followed' => $isFollowed
        ];
    }
}
