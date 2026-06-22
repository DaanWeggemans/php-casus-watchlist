<?php

namespace App\Http\Controllers;

use App\Http\Requests\followed\CreateFollowedRequest;
use App\Http\Resources\feed\FeedResource;
use App\Models\Feed;
use App\Models\Followed;
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

    public function createFollowed(CreateFollowedRequest $request)
    {
        $user = User::find($request->input('followed_user_id'));
        if ($user == null)
            return response()->json([
                "code" => 400,
                "message" => "The user does not exist."
            ], 400);

        $exists = Followed::where('user_id', $request->user()->id)
            ->where('followed_user_id', $user->id)
            ->exists();
        if ($exists)
            return response()->json([
                "code" => 400,
                "message" => "The user cannot be followed twice."
            ], 400);

        $followed = Followed::create([
            'followed_user_id' => $request->input('followed_user_id'),
            'user_id' => $request->user()->id
        ]);

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
