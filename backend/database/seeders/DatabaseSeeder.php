<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->callWith(ProjectSeeder::class, [
            'max_amount_users' => 6,
            'max_amount_franchises' => 10,
            'max_amount_series' => 10,
            'max_amount_episodes' => 25,
            'chance_to_feed' => 10
        ]);
    }
}
