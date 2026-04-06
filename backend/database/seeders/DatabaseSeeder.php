<?php

namespace Database\Seeders;

use App\Models\Franchise;
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
        // User::factory(10)->create();

        $user_id = Str::uuid();
        User::factory()->create([
            'id' => $user_id,
            'username' => 'Test',
            'email' => 'test@test.com',
            'password' => Hash::make('test')
        ]);

        Franchise::create([
            'id' => Str::uuid(),
            'name' => 'Franchise1',
            'index' => 1,
            'user_id' => $user_id
        ]);
    }
}
