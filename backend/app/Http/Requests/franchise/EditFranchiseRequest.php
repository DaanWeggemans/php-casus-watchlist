<?php

namespace App\Http\Requests\franchise;

use App\Models\Franchise;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class EditFranchiseRequest extends FormRequest
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
        $count = Franchise::where('user_id', $this->user()->id)->count();

        return [
            'name' => ['required_without:index', 'string'],
            'index' => ['required_without:name', 'integer', 'min:1', "max:$count"]
        ];
    }
}
