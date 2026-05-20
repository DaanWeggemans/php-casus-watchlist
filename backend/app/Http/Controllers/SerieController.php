<?php

namespace App\Http\Controllers;

use App\Http\Requests\serie\CreateSerieRequest;
use App\Http\Resources\serie\SerieResource;
use App\Models\Serie;
use Illuminate\Http\Request;

class SerieController extends Controller
{
    public function getAll(Request $request)
    {
        $series = Serie::where('user_id', $request->user()->id)
            ->orderBy('index')
            ->orderBy('updated_at')
            ->get();
        return SerieResource::collection($series);
    }

    public function getAllFromFranchise(Request $request, string $franchise_id)
    {
        $series = Serie::where('user_id', $request->user()->id)
            ->where('franchise_id', $franchise_id)
            ->orderBy('index')
            ->orderBy('updated_at')
            ->get();
        return SerieResource::collection($series);
    }

    public function create(CreateSerieRequest $request)
    {
        $index = Serie::where('user_id', $request->user()->id)->count() + 1;

        $image = null;
        if ($request->hasFile('image')) {
            $result = file_get_contents($request->file('image')->getRealPath());
            if ($result != false)
                $image = $result;
        }

        $serie = Serie::create([
            'name' => $request->name,
            'type' => $request->type,
            'done' => $request->done,
            'index' => $index,
            'season' => $request->season,
            'image' => $image,
            'franchise_id' => $request->franchise_id,
            'user_id' => $request->user()->id
        ]);

        return new SerieResource($serie);
    }
}
