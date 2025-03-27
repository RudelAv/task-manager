<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{
    public function store(CreateTaskRequest $request)
    {
        \Log::debug('Données reçues:', $request->all());
        
        $validated = $request->validated();
        
        $task = $request->user()->tasks()->create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'due_date' => $validated['due_date']
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('tasks', 'public');
            $task->update(['image_path' => $path]);
        }

        return response()->json($task, 201);
    }

    /**
     * Affiche une liste paginée de toutes les tâches.
     */
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 15); 
            $tasks = Task::paginate($perPage);
            
            return response()->json([
                'success' => true,
                'data' => $tasks
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des tâches',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Marque une tâche comme terminée.
     */
    public function markAsCompleted(Request $request, $id)
    {
        try {
            $task = Task::findOrFail($id);
            
            // Vérifier que l'utilisateur est bien le propriétaire de la tâche
            if ($task->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous n\'êtes pas autorisé à modifier cette tâche'
                ], 403);
            }
            
            // Mettre à jour le statut de la tâche
            $task->update([
                'completed' => true
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Tâche marquée comme terminée',
                'data' => $task
            ], 200);
            
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour de la tâche',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Met à jour une tâche existante.
     */
    public function update(UpdateTaskRequest $request, $id)
    {
        try {
            $validated = $request->validated();

            $task = Task::findOrFail($id);
            
            // Vérifier que l'utilisateur est bien le propriétaire de la tâche
            if ($task->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous n\'êtes pas autorisé à modifier cette tâche'
                ], 403);
            }
            
            // Supprimer l'ancienne image si une nouvelle est fournie
            if ($request->hasFile('image') && $task->image_path) {
                Storage::disk('public')->delete($task->image_path);
            }

            // Mise à jour des données de base
            $task->update([
                'title' => $validated['title'] ?? $task->title,
                'description' => $validated['description'] ?? $task->description,
                'due_date' => $validated['due_date'] ?? $task->due_date
            ]);

            // Stocker la nouvelle image si elle existe
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('tasks', 'public');
                $task->update(['image_path' => $path]);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Tâche mise à jour avec succès',
                'data' => $task
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour de la tâche',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprime une tâche existante.
     */
    public function destroy(Request $request, $id)
    {
        try {
            $task = Task::findOrFail($id);
            
            // Vérifier que l'utilisateur est bien le propriétaire de la tâche
            if ($task->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous n\'êtes pas autorisé à supprimer cette tâche'
                ], 403);
            }
            
            if ($task->image_path) {
                Storage::disk('public')->delete($task->image_path);
            }
            
            $task->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Tâche supprimée avec succès'
            ], 200);
            
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de la tâche',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
