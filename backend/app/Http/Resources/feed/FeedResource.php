<?php

namespace App\Http\Resources\feed;

use App\Http\Resources\serie\SerieResource;
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
        $serie = (new SerieResource($this->resource->serie))->resolve();
        $user = (new UserResource($this->resource->user))->resolve();

        return [
            'id' => $this->id,
            'serie' => $serie,
            'user' => $user
        ];
    }
}
