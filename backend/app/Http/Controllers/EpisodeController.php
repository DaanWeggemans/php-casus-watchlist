<?php

namespace App\Http\Controllers;

use App\Http\Requests\episode\CreateEpisodeRequest;
use App\Http\Resources\episode\EpisodeResource;
use App\Models\Episode;
use App\Models\Serie;
use Illuminate\Http\Request;

class EpisodeController extends Controller
{
    public function getAll(Request $request)
    {
        $episodes = Episode::where('user_id', $request->user()->id)
            ->orderBy('index')
            ->orderBy('updated_at')
            ->get();

        return EpisodeResource::collection($episodes);
    }

    public function getAllFromSerie(Request $request, Serie $serie)
    {
        if ($serie->user_id != $request->user()->id)
            return response()->json([
                "code" => 403,
                "message" => "The user does not have access to the serie."
            ], 403);

        return EpisodeResource::collection($serie->episodes);
    }

    public function createAll(CreateEpisodeRequest $request)
    {
        $episodes = $request->array('episodes');
        foreach ($episodes as $index => $episode) {
            $episode['index'] = $index + 1;
            $episode['serie_id'] = $request['serie_id'];
            $episode['user_id'] = $request->user()->id;
            $episodes[$index] = Episode::create($episode);
        }
    
        return EpisodeResource::collection($episodes);
    }
}
