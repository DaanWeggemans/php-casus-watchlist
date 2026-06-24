<?php

namespace Database\Factories;

use App\Models\Serie;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Serie>
 */
class SerieFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement([
            'serie', 'movie'
        ]);

        return [
            'name' => fake()->word(),
            'type' => $type,
            'done' => $type == 'movie' ? fake()->boolean() : false,
            'season' => $type == 'serie' ? fake()->numberBetween(1, 5) : null,
        ];
    }
}
