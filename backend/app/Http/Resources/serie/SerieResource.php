<?php

namespace App\Http\Resources\serie;

use finfo;
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
        $image = $this->image;
        if ($image) {
            $mimeType = (new finfo(FILEINFO_MIME_TYPE))->buffer($image) ?: "image/jpeg";
            if (!str_starts_with($mimeType, "image/"))
                $mimeType = "image/jpeg";

            $image = "data:$mimeType;base64," . base64_encode($image);
        }
        
        return [
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'done' => (bool) $this->done,
            'season' => $this->season,
            'image' => $image,
            'index' => $this->index
        ];
    }
}
