<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rules\Password;
use Illuminate\Contracts\Validation\Validator;

class RegisterRequest extends FormRequest
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
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => [
                'required',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
            ]
        ];
    }

    public function failedValidation(Validator $validator)
    {
        Throw new HttpResponseException(response()->json([
            'message' => 'Validation Error',
            'errors' => $validator->errors()
        ], 422));
    }

    public function messages()
    {
        return [
            'password.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
            'password.letters' => 'Le mot de passe doit contenir au moins une lettre.',
            'password.mixedCase' => 'Le mot de passe doit contenir au moins une lettre majuscule et une lettre minuscule.',
            'password.numbers' => 'Le mot de passe doit contenir au moins un chiffre.',
            'password.symbols' => 'Le mot de passe doit contenir au moins un symbole.',
            'name.required' => 'Le nom est obligatoire.',
            'email.required' => 'L\'email est obligatoire.',
            'email.email' => 'L\'email doit avoir un format valide.',
            'email.unique' => 'L\'email est deja utilise.',
        ];
    }
}
