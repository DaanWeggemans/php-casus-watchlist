<?php

namespace App\Http\Controllers;

use App\Http\Requests\feed\CreateFeedRequest;
use App\Http\Requests\followed\CreateFollowedRequest;
use App\Http\Resources\feed\FeedResource;
use App\Models\Feed;
use App\Models\Followed;
use App\Models\Serie;
use App\Models\User;
use Illuminate\Http\Request;

class FeedController extends Controller
{
    public function get()
    {
        return FeedResource::collection(Feed::all());
    }

    public function getFollowed(Request $request)
    {
        $user_id = $request->user()->id;
        $feeds = Feed::whereIn('user_id', function ($query) use ($user_id) {
            $query->select('followed_user_id')
                ->from('followed')
                ->where('user_id', $user_id);
        })->get();

        return FeedResource::collection($feeds);
    }

    public function createFeed(CreateFeedRequest $request) {
        $serie = Serie::find($request->input('serie_id'));
        if ($serie == null)
            return response()->json([
                "code" => 404,
                "message" => "The serie does not exist."
            ], 404);

        $exists = Feed::where('user_id', $request->user()->id)
            ->where('serie_id', $serie->id)
            ->exists();
        if ($exists)
            return response()->json([
                "code" => 400,
                "message" => "The serie cannot be shared twice."
            ], 400);

        Feed::create([
            'serie_id' => $request->input('serie_id'),
            'user_id' => $request->user()->id
        ]);

        return response()->noContent();
    }

    public function createFollowed(CreateFollowedRequest $request)
    {
        if ($request->user()->id == $request->input('followed_user_id'))
            return response()->json([
                "code" => 400,
                "message" => "The user cannot follow himself."
            ], 400);

        $user = User::find($request->input('followed_user_id'));
        if ($user == null)
            return response()->json([
                "code" => 404,
                "message" => "The user does not exist."
            ], 404);

        $exists = Followed::where('user_id', $request->user()->id)
            ->where('followed_user_id', $user->id)
            ->exists();
        if ($exists)
            return response()->json([
                "code" => 400,
                "message" => "The user cannot be followed twice."
            ], 400);

        Followed::create([
            'followed_user_id' => $request->input('followed_user_id'),
            'user_id' => $request->user()->id
        ]);

        return response()->noContent();
    }
    
    public function removeFeed(Request $request, Serie $serie) {
        $feed = Feed::where('user_id', $request->user()->id)
            ->where('serie_id', $serie->id)
            ->first();

        if ($feed == null)
            return response()->json([
                "code" => 400,
                "message" => "The serie is not shared on the feed."
            ], 400);

        if ($feed->user_id != $request->user()->id)
            return response()->json([
                "code" => 403,
                "message" => "The user does not have access to this feed."
            ], 403);

        $feed->delete();
        return response()->noContent();
    }

    public function removeFollowed(Request $request, User $user)
    {
        $followed = Followed::where('user_id', $request->user()->id)
            ->where('followed_user_id', $user->id)
            ->first();

        if ($followed == null) {
            return response()->json([
                "code" => 404,
                "message" => "You are not following this user."
            ], 404);
        }

        if ($followed->user_id != $request->user()->id)
            return response()->json([
                "code" => 403,
                "message" => "The user does not have access to the followed."
            ], 403);

        $followed->delete();
        return response()->noContent();
    }
}
