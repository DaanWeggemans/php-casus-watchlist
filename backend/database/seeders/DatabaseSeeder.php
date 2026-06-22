<?php

namespace Database\Seeders;

use App\Models\Episode;
use App\Models\Feed;
use App\Models\Franchise;
use App\Models\Serie;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user_id = Str::uuid();
        User::create([
            'id' => $user_id,
            'username' => 'test',
            'email' => 'test@test.com',
            'password' => Hash::make('test')
        ]);

        $franchise_id = Str::uuid();
        Franchise::create([
            'id' => $franchise_id,
            'name' => 'Franchise1',
            'index' => 1,
            'user_id' => $user_id
        ]);

        $serie_id = Str::uuid();
        Serie::create([
            'id' => $serie_id,
            'name' => 'Serie1',
            'type' => 'serie',
            'done' => false,
            'index' => 1,
            'season' => 1,
            'image' => null,
            'franchise_id' => $franchise_id,
            'user_id' => $user_id
        ]);

        for ($i = 0; $i < 25; $i++)
            Episode::create([
                'name' => null,
                'done' => rand(0, 10) == 6,
                'index' => $i + 1,
                'serie_id' => $serie_id,
                'user_id' => $user_id
            ]);

        Feed::create([
            "serie_id" => $serie_id,
            "user_id" => $user_id
        ]);
    }
}
