<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class CreateTaskRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'required|date|after_or_equal:today',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:3048',
            'completed' => 'prohibited'
        ];
    }

    public function all($keys = null)
    {
        $data = parent::all($keys);
        $data['due_date'] = $this->input('due_date'); 
        return $data;
    }

    public function attributes()
    {
        return [
            'due_date' => 'date d\'échéance',
            'image' => 'image'
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Validation Error',
            'errors' => $validator->errors()
        ], 422));
    }

    public function messages()
    {
        return [
            'title.required' => 'Le titre est obligatoire.',
            'title.max' => 'Le titre ne doit pas contenir plus de 255 caractères.',
            'description.max' => 'La description ne doit pas contenir plus de 255 caractères.',
            'due_date.required' => 'La date d\'échéance est obligatoire.',
            'due_date.after_or_equal' => 'La date d\'échéance doit etre postérieure ou égale aujourd\'hui.',
            'image.mimes' => 'Le fichier doit avoir une extension JPEG, PNG, JPG ou GIF.',
            'image.max' => 'Le fichier doit avoir une taille maximale de 2Mo.',
        ];
    }
}
