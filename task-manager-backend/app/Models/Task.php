<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'image_path',
        'due_date',
        'completed',
        'user_id'
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'completed' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Méthode pour le chemin complet de l'image
    public function getImageUrlAttribute()
    {
        return $this->image_path ? asset('storage/'.$this->image_path) : null;
    }
}
