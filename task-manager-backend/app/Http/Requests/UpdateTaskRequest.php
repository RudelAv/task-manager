<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'image' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif|max:3048',
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
            'title.max' => 'Le titre ne doit pas contenir plus de 255 caractères.',
            'description.max' => 'La description ne doit pas contenir plus de 255 caractères.',
            'image.mimes' => 'Le fichier doit avoir une extension JPEG, PNG, JPG ou GIF.',
            'image.max' => 'Le fichier doit avoir une taille maximale de 2Mo.',
        ];
    }
}
