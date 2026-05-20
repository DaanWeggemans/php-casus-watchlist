<?php

namespace App\Http\Requests\serie;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CreateSerieRequest extends FormRequest
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
        return [
            'name' => ['required'],
            'type' => ['required'],
            'done' => ['required', 'boolean'],
            'season' => ['required_if:type,serie', 'integer', 'min:1'],
            'image' => ['image'],
            'franchise_id' => ['required'],
        ];
    }
}
