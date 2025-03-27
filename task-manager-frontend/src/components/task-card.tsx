'use client';

import { useEffect, useState } from 'react';
import { Task } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Trash2, Edit, Clock } from 'lucide-react';
import { TaskForm } from '@/components/task-form';
import { format, isPast, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  currentUserId: string;
  onComplete: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (data: Partial<Task>, image?: File) => Promise<void>;
}

export function TaskCard({ task, currentUserId, onComplete, onDelete, onEdit }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const isOwner = task.userId == currentUserId;
  useEffect(() => {
    console.log(task);
    console.log(currentUserId);
  }, [task, currentUserId]);
  const dueDate = new Date(task.due_date);
  const isOverdue = isPast(dueDate) && !isToday(dueDate) && !task.completed;

  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleStatusChange = async (checked: boolean) => {
    if (isUpdatingStatus) return;
    
    setIsUpdatingStatus(true);
    try {
      await onComplete(task.id, checked);
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  
  const handleEdit = async (data: Partial<Task>, image?: File) => {
    await onEdit(data, image);
    setIsEditModalOpen(false);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMMM yyyy', { locale: fr });
  };

  return (
    <Card className={`w-full ${isOverdue ? 'border-red-500' : ''} overflow-hidden ${task.completed ? 'opacity-70' : ''}`}>
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            <Checkbox
              checked={task.completed}
              onCheckedChange={handleStatusChange}
              className="mt-1"
              disabled={isUpdatingStatus}
            />
            <div>
              <CardTitle className={task.completed ? 'line-through text-muted-foreground' : ''}>
                {task.title}
              </CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(task.due_date)}
                {isOverdue && (
                  <span className="ml-2 text-red-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    En retard
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
          {isOwner && (
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsEditModalOpen(true)}
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      {task.description && (
        <CardContent>
          <p className={task.completed ? 'line-through text-muted-foreground' : ''}>
            {task.description}
          </p>
        </CardContent>
      )}
      
      {/* Modale d'édition */}
      {isEditModalOpen && (
        <TaskForm 
          task={task} 
          onSubmit={handleEdit} 
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
        />
      )}
    </Card>
  );
}