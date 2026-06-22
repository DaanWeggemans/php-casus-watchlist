<?php

namespace App\Http\Resources\feed;

use App\Http\Resources\serie\DetailSerieResource;
use App\Http\Resources\user\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FeedResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $serie = (new DetailSerieResource($this->resource->serie))->resolve();
        $user = (new UserResource($this->resource->user))->resolve();

        return [
            'id' => $this->id,
            'serie' => $serie,
            'user' => $user,
            'shared_on' => $this->created_at
        ];
    }
}
