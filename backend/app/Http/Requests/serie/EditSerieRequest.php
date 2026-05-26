<?php

namespace App\Http\Requests\serie;

use App\Models\Serie;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class EditSerieRequest extends FormRequest
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
        $count = Serie::where('user_id', $this->user()->id)
            ->where('franchise_id', $this->input('franchise_id'))
            ->count();

        return [
            'name' => ['sometimes'],
            'index' => ['sometimes', 'integer', "max:$count"],
            'done' => ['sometimes', 'boolean'],
            'season' => ['sometimes', 'required_if:type,serie', 'integer', 'min:1'],
            'image' => ['sometimes', 'image', 'nullable'],
            'franchise_id' => ['required']
        ];
    }

    public function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            if (!$this->hasAny(['name', 'index', 'done', 'season', 'image'])) {
                $validator->errors()->add(
                    'request',
                    'At least one field must be provided.'
                );
            }
        });
    }
}
