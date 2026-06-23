<?php

namespace App\Http\Resources\serie;

use App\Http\Resources\common\Image;
use App\Models\Feed;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SerieResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $image = (new Image(['image' => $this->image]))->resolve()['image'];
        $is_shared = Feed::where('user_id', $request->user()->id)
            ->where('serie_id', $this->id)
            ->exists();
        
        return [
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'done' => (bool) $this->done,
            'season' => $this->season,
            'image' => $image,
            'index' => $this->index,
            'is_shared' => $is_shared
        ];
    }
}
