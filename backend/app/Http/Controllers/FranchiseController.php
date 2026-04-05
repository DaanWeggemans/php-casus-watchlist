<?php

namespace App\Http\Controllers;

use App\Models\Franchise;
use Illuminate\Http\Request;

class FranchiseController extends Controller
{
    public function getAll(Request $request)
    {
        $franchises = Franchise::where('user_id', $request->user()->id)->get(['id', 'name', 'index']);
        return $franchises;
    }

    public function get(Request $request, Franchise $franchise)
    {
        if ($franchise->user_id != $request->user()->id)
            return response()->noContent(400);
        return $franchise;
    }

    public function create(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required']
        ]);

        $index = Franchise::where('user_id', $request->user()->id)->count() + 1;

        $franchise = Franchise::create([
            'name' => $validated['name'],
            'index' => $index,
            'user_id' => $request->user()->id
        ]);

        return $franchise;
    }

    public function delete(Request $request, Franchise $franchise)
    {
        if ($franchise->user_id != $request->user()->id)
            return response()->noContent(400);

        $franchise->delete();
        return response()->noContent();
    }

    public function edit(Request $request, Franchise $franchise)
    {
        if ($franchise->user_id != $request->user()->id)
            return response()->noContent(400);

        if ($request->has('name')) {
            $validated = $request->validate([
                'name' => ['required']
            ]);

            $franchise->name = $validated['name'];
        }

        if ($request->has('index')) {
            $validated = $request->validate([
                'index' => ['required', 'integer', 'min:1']
            ]);

            $franchise->index = $validated['index'];
        }

        $franchise->save();
        return response()->noContent();
    }
}
