<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TaskControllerAdmin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Authentification
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Creer une tache
Route::middleware('auth:sanctum')->post('/tasks', [TaskController::class, 'store']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    // Route pour lister toutes les tâches avec pagination
    Route::get('/tasks', [TaskController::class, 'index']);
    
    // Route pour marquer une tâche comme terminée
    Route::patch('/tasks/{id}/complete', [TaskController::class, 'markAsCompleted']);
    
    // Nouvelles routes pour la modification et la suppression
    Route::put('/tasks/{id}', [TaskController::class, 'update']);
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);

    Route::get('/tasks/admin', [TaskControllerAdmin::class,'index']);
    
});
