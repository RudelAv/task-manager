'use client';

import { useEffect, useState } from 'react';
import { Task } from '@/lib/types';
import { createTask, deleteTask, getTasks, updateTask } from '@/lib/api';
import { TaskCard } from '@/components/task-card';
import { TaskForm } from '@/components/task-form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Simuler un utilisateur connecté (à remplacer par votre système d'auth)
  const currentUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com'
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const tasks = await getTasks();
      setTasks(tasks);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les tâches',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (data: Partial<Task>) => {
    try {
      const newTask = await createTask(data as Omit<Task, 'id' | 'userId' | 'createdAt' | 'completed'>);
      setTasks([...tasks, newTask]);
      toast({
        title: 'Succès',
        description: 'Tâche créée avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la tâche',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateTask = async (taskId: string, data: Partial<Task>) => {
    try {
      const updatedTask = await updateTask(taskId, data);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      toast({
        title: 'Succès',
        description: 'Tâche mise à jour avec succès',
      });
    } catch (error) {
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
      setTasks(tasks.filter(task => task.id !== taskId));
      toast({
        title: 'Succès',
        description: 'Tâche supprimée avec succès',
      });
    } catch (error) {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Mes tâches</h1>
        <TaskForm onSubmit={handleCreateTask} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            currentUserId={currentUser.id}
            onComplete={handleCompleteTask}
            onDelete={handleDeleteTask}
            onEdit={(task) => handleUpdateTask(task.id, task)}
          />
        ))}
        {tasks.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">Aucune tâche pour le moment</p>
            <TaskForm onSubmit={handleCreateTask} />
          </div>
        )}
      </div>
    </div>
  );
}