<?php

namespace App\Http\Controllers;

use App\Http\Requests\serie\CreateSerieRequest;
use App\Http\Requests\serie\EditSerieRequest;
use App\Http\Resources\serie\SerieResource;
use App\Models\Franchise;
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
        $franchise_exists = Franchise::where('user_id', $request->user()->id)
            ->where('id', $request->franchise_id)
            ->exists();
        if (!$franchise_exists)
            return response()->json([
                "code" => 404,
                "message" => "The franchise does not exist."
            ], 404);

        $index = Serie::where('user_id', $request->user()->id)
            ->where('franchise_id', $request->franchise_id)
            ->count() + 1;

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

    public function delete(Request $request, Serie $serie)
    {
        if ($serie->user_id != $request->user()->id)
            return response()->json([
                "code" => 403,
                "message" => "The user does not have access to the serie."
            ], 403);

        Serie::where('user_id', $request->user()->id)
            ->where('franchise_id', $serie->franchise_id)
            ->where('index', '>', $serie->index)
            ->decrement('index');
            
        $serie->delete();
        return response()->noContent();
    }

    public function edit(EditSerieRequest $request, Serie $serie)
    {
        if ($serie->user_id != $request->user()->id)
            return response()->json([
                "code" => 403,
                "message" => "The user does not have access to the serie."
            ], 403);

        if ($request->has('name')) {
            $serie->name = $request['name'];
            $serie->save();
        }

        if ($request->has('index')) {
            Serie::where('user_id', $request->user()->id)
                ->where('franchise_id', $serie->franchise_id)
                ->where('index', '>', $serie->index)
                ->decrement('index');

            $serie->index = $request['index'];
            $serie->save();
            Serie::where('user_id', $request->user()->id)
                ->where('franchise_id', $serie->franchise_id)
                ->where('index', '>=', $serie->index)
                ->where('id', '!=', $serie->id)
                ->increment('index');
        }

        if ($request->has('done')) {
            $serie->done = $request['done'];
            $serie->save();
        }

        if ($request->has('season')) {
            $serie->season = $request['season'];
            $serie->save();
        }

        if ($request->has('image') && $request->image == null) {
            $serie->image = null;
            $serie->save();
        }

        if ($request->hasFile('image')) {
            $result = file_get_contents($request->file('image')->getRealPath());

            $image = null;
            if ($result != false)
                $image = $result;

            $serie->image = $image;
            $serie->save();
        }

        return response()->noContent();
    }
}
