<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateFranchiseRequest;
use App\Http\Requests\franchise\EditFranchiseRequest;
use App\Models\Franchise;
use Illuminate\Http\Request;

class FranchiseController extends Controller
{
    public function getAll(Request $request)
    {
        $franchises = Franchise::where('user_id', $request->user()->id)
            ->orderBy('index')
            ->orderBy('updated_at')
            ->get(['id', 'name', 'index']);
        return $franchises;
    }

    public function get(Request $request, Franchise $franchise)
    {
        if ($franchise->user_id != $request->user()->id)
            return response()->noContent(403);
        return $franchise->only(['id', 'name', 'index']);
    }

    public function create(CreateFranchiseRequest $request)
    {
        $index = Franchise::where('user_id', $request->user()->id)->count() + 1;

        $franchise = Franchise::create([
            'name' => $request['name'],
            'index' => $index,
            'user_id' => $request->user()->id
        ]);

        return $franchise;
    }

    public function delete(Request $request, Franchise $franchise)
    {
        if ($franchise->user_id != $request->user()->id)
            return response()->noContent(403);

        Franchise::where('user_id', $request->user()->id)
            ->where('index', '>', $franchise->index)
            ->decrement('index');
            
        $franchise->delete();
        return response()->noContent();
    }

    public function edit(EditFranchiseRequest $request, Franchise $franchise)
    {
        if ($franchise->user_id != $request->user()->id)
            return response()->noContent(403);

        if ($request->has('name')) {
            $franchise->name = $request['name'];
            $franchise->save();
        }

        if ($request->has('index')) {
            Franchise::where('user_id', $request->user()->id)
                ->where('index', '>', $franchise->index)
                ->decrement('index');

            $franchise->index = $request['index'];
            $franchise->save();
            Franchise::where('user_id', $request->user()->id)
                ->where('index', '>=', $franchise->index)
                ->where('id', '!=', $franchise->id)
                ->increment('index');
        }
            
        return response()->noContent();
    }
}
