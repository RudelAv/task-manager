<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Exception;
use Illuminate\Http\Request;

class TaskControllerAdmin extends Controller
{
    public function index(Request $request)
    {
        try {
            $perPage = $request->input('per_page', default: 10); 
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
}
