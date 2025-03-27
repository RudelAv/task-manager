'use client';

import { useEffect, useState } from 'react';
import { Task } from '@/lib/types';
import { createTask, deleteTask, getTasks, updateTask } from '@/lib/api';
import { TaskCard } from '@/components/task-card';
import { TaskForm } from '@/components/task-form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';
import { getCurrentUser } from '@/lib/auth';

// Interface pour la réponse paginée de l'API
interface PaginatedResponse<T> {
  success: boolean;
  data: {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

// Interface pour adapter la structure de la tâche de l'API
interface ApiTask {
  id: number;
  title: string;
  description: string;
  image_path: string;
  due_date: string;
  completed: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();
  
  // Récupérer l'utilisateur connecté
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadTasks();
  }, [currentPage]);

  const loadTasks = async () => {
    try {
      const response = await getTasks() as PaginatedResponse<ApiTask>;
      
      if (response.success) {
        const formattedTasks: Task[] = response.data.data.map(apiTask => ({
          id: apiTask.id.toString(),
          title: apiTask.title,
          description: apiTask.description,
          imageUrl: apiTask.image_path ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${apiTask.image_path}` : '',
          due_date: new Date(apiTask.due_date).toISOString().split('T')[0],
          completed: apiTask.completed,
          userId: apiTask.user_id.toString(),
          createdAt: apiTask.created_at
        }));
        
        setTasks(formattedTasks);
        setCurrentPage(response.data.current_page);
        setTotalPages(response.data.last_page);
      } else {
        throw new Error('Échec de récupération des tâches');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les tâches',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (data: Partial<Task>, image?: File) => {
    try {
      const taskData = {
        title: data.title || '',
        description: data.description || '',
        due_date: data.due_date || new Date().toISOString().split('T')[0]
      };
      
      console.log("Données envoyées:", taskData);
      
      await createTask(taskData, image);
      
      // Recharger les tâches après création
      loadTasks();
      
      toast({
        title: 'Succès',
        description: 'Tâche créée avec succès',
      });
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la tâche',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateTask = async (taskId: string, data: Partial<Task>, image?: File) => {
    try {
      await updateTask(taskId, data, image);
      
      // Recharger les tâches après mise à jour
      loadTasks();
      
      toast({
        title: 'Succès',
        description: 'Tâche mise à jour avec succès',
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour la tâche',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      
      // Filtrer les tâches localement pour une mise à jour immédiate de l'UI
      setTasks(tasks.filter(task => task.id !== taskId));
      
      toast({
        title: 'Succès',
        description: 'Tâche supprimée avec succès',
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la tâche',
        variant: 'destructive',
      });
    }
  };

  const handleCompleteTask = async (taskId: string, completed: boolean) => {
    await handleUpdateTask(taskId, { completed });
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <AuthGuard>
      <main className="flex min-h-screen flex-col items-center p-6 md:p-12">
        <div className="container mx-auto py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <h1 className="text-3xl font-bold">Mes tâches</h1>
            <TaskForm onSubmit={handleCreateTask} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                currentUserId={currentUser?.id || ''}
                onComplete={handleCompleteTask}
                onDelete={handleDeleteTask}
                onEdit={(data, image) => handleUpdateTask(task.id, data, image)}
              />
            ))}
            {tasks.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground mb-4">Aucune tâche pour le moment</p>
                <TaskForm onSubmit={handleCreateTask} />
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border disabled:opacity-50"
                >
                  Précédent
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page 
                        ? 'bg-primary text-primary-foreground' 
                        : 'border hover:bg-accent'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded border disabled:opacity-50"
                >
                  Suivant
                </button>
              </nav>
            </div>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}