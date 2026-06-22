<?php

namespace App\Http\Controllers;

use App\Http\Resources\feed\FeedResource;
use App\Models\Feed;
use Illuminate\Http\Request;

class FeedController extends Controller
{
    public function get()
    {
        return FeedResource::collection(Feed::all());
    }
}
