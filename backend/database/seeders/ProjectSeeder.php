<?php

namespace Database\Seeders;

use App\Models\Episode;
use App\Models\Feed;
use App\Models\Franchise;
use App\Models\Serie;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run($max_amount_users = 6, $max_amount_franchises = 10, $max_amount_series = 10, $max_amount_episodes = 25, $chance_to_feed = 10): void
    {
        $amount_users = rand(1, $max_amount_users);
        for ($user_index = 1; $user_index <= $amount_users; $user_index++) {
            $user = User::factory()->create();

            $amount_franchises = rand(1, $max_amount_franchises);
            for ($franchise_index = 1; $franchise_index <= $amount_franchises; $franchise_index++) {
                $franchise = Franchise::factory()->create([
                    'index' => $franchise_index,
                    'user_id' => $user->id
                ]);

                $amount_series = rand(1, $max_amount_series);
                for ($serie_index = 1; $serie_index <= $amount_series; $serie_index++) {
                    $amount_episodes = rand(1, $max_amount_episodes);
                    $amount_episodes_done = rand(0, $amount_episodes);

                    $serie = Serie::factory()->create([
                        'done' => $amount_episodes == $amount_episodes_done,
                        'index' => $serie_index,
                        'franchise_id' => $franchise->id,
                        'user_id' => $user->id
                    ]);

                    for ($episode_index = 1; $episode_index <= $amount_episodes; $episode_index++) {
                        Episode::factory()->create([
                            'done' => $episode_index <= $amount_episodes_done,
                            'index' => $episode_index,
                            'serie_id' => $serie->id,
                            'user_id' => $user->id
                        ]);
                    }

                    if (fake()->boolean($chance_to_feed)) {
                        Feed::create([
                            "serie_id" => $serie->id,
                            "user_id" => $user->id
                        ]);
                    }
                }
            }
        }
    }
}
