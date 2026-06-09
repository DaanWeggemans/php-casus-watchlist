<?php

namespace App\Http\Resources\common;

use finfo;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class Image extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $image = data_get($this->resource, 'image');

        if ($image) {
            $mimeType = (new finfo(FILEINFO_MIME_TYPE))->buffer($image) ?: "image/jpeg";
            if (!str_starts_with($mimeType, "image/"))
                $mimeType = "image/jpeg";

            $image = "data:$mimeType;base64," . base64_encode($image);
        }

        return ['image' => $image];
    }
}
