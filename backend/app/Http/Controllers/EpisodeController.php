<?php

namespace App\Http\Controllers;

use App\Http\Requests\episode\CreateEpisodeRequest;
use App\Http\Requests\episode\EditEpisodeRequest;
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

        return EpisodeResource::collection($serie->episodes()->orderBy('index')->get());
    }

    public function createAll(CreateEpisodeRequest $request)
    {
        $serie = Serie::select(['user_id', 'type'])
            ->where('id', $request->input('serie_id'))
            ->first();

        if ($serie == null)
            return response()->json([
                "code" => 404,
                "message" => "The serie does not exist."
            ], 404);
 
        if ($serie->user_id != $request->user()->id)
            return response()->json([
                "code" => 403,
                "message" => "The user does not have access to the serie."
            ], 403);

        if ($serie->type == "movie")
            return response()->json([
                "code" => 400,
                "message" => "Episodes cannot be added to a movie."
            ], 400);

        $episodes = $request->array('episodes');
        $count = Episode::where('user_id', $request->user()->id)
            ->where('serie_id', $request->input('serie_id'))
            ->count();

        foreach ($episodes as $index => $episode) {
            $episode['index'] = ++$count;
            $episode['done'] = false;
            $episode['serie_id'] = $request['serie_id'];
            $episode['user_id'] = $request->user()->id;
            $episodes[$index] = Episode::create($episode);
        }
    
        return EpisodeResource::collection($episodes);
    }

    public function delete(Request $request, Episode $episode)
    {
        if ($episode->user_id != $request->user()->id)
            return response()->json([
                "code" => 403,
                "message" => "The user does not have access to the episode."
            ], 403);

        Episode::where('user_id', $request->user()->id)
            ->where('serie_id', $episode->serie_id)
            ->where('index', '>', $episode->index)
            ->decrement('index');
            
        $episode->delete();
        return response()->noContent();
    }

    public function edit(EditEpisodeRequest $request, Episode $episode)
    {
        if ($episode->user_id != $request->user()->id)
            return response()->json([
                "code" => 403,
                "message" => "The user does not have access to the episode."
            ], 403);

        if ($request->has('name')) {
            $episode->name = $request['name'];
            $episode->save();
        }

        if ($request->has('done')) {
            $episode->done = $request['done'];
            $episode->save();

            $total = Episode::where('user_id', $request->user()->id)
                ->where('serie_id', $episode->serie_id)
                ->count();

            $total_done = Episode::where('user_id', $request->user()->id)
                ->where('serie_id', $episode->serie_id)
                ->where('done', true)
                ->count();

            if ($total == $total_done)
                Serie::where('id', $episode->serie_id)->update(['done' => true]);
        }

        if ($request->has('index')) {
            Episode::where('user_id', $request->user()->id)
                ->where('serie_id', $episode->serie_id)
                ->where('index', '>', $episode->index)
                ->decrement('index');

            $episode->index = $request['index'];
            $episode->save();
            Episode::where('user_id', $request->user()->id)
                ->where('serie_id', $episode->serie_id)
                ->where('index', '>=', $episode->index)
                ->where('id', '!=', $episode->id)
                ->increment('index');
        }
        
        return response()->noContent();
    }
}
