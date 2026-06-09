<?php

namespace App\Http\Resources\franchise;

use App\Http\Resources\common\Image;
use App\Models\Serie;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FranchiseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $image = Serie::where('franchise_id', $this->id)
            ->whereNotNull('image')
            ->orderByDesc('index')
            ->value('image');
        $image = (new Image(['image' => $image]))->resolve()['image'];

        return [
            'id' => $this->id,
            'name' => $this->name,
            'index' => $this->index,
            'image' => $image
        ];
    }
}
