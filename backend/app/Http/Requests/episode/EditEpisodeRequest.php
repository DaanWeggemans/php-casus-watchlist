<?php

namespace App\Http\Requests\episode;

use App\Models\Episode;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class EditEpisodeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $count = Episode::where('user_id', $this->user()->id)
            ->where('serie_id', $this->input('serie_id'))
            ->count();

        return [
            'name' => ['sometimes', 'string', 'nullable'],
            'done' => ['sometimes', 'boolean'],
            'index' => ['sometimes', 'integer', "max:$count"],
            'serie_id' => ['required_with:index']
        ];
    }

    public function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            if (!$this->hasAny(['name', 'done', 'index'])) {
                $validator->errors()->add(
                    'request',
                    'At least one field must be provided.'
                );
            }
        });
    }
}
