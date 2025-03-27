'use client';

import { useState } from 'react';
import { Task } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { Calendar, Trash2, Edit } from 'lucide-react';
import { TaskForm } from '@/components/task-form';

interface TaskCardProps {
  task: Task;
  currentUserId: string;
  onComplete: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (data: Partial<Task>, image?: File) => Promise<void>;
}

export function TaskCard({ task, currentUserId, onComplete, onDelete, onEdit }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const isOwner = task.userId === currentUserId;
  const isOverdue = new Date(task.due_date) < new Date();

  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Card className={`w-full ${isOverdue && !task.completed ? 'border-red-500' : ''} overflow-hidden ${task.completed ? 'opacity-70' : ''}`}>
      {/* {task.imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={task.imageUrl}
            alt={task.title}
            fill
            className="object-cover"
          />
        </div>
      )} */}
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            <Checkbox
              checked={task.completed}
              onCheckedChange={(checked) => onComplete(task.id, checked as boolean)}
              className="mt-1"
            />
            <div>
              <CardTitle className={task.completed ? 'line-through text-muted-foreground' : ''}>
                {task.title}
              </CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(task.due_date)}
              </CardDescription>
            </div>
          </div>
          {isOwner && (
            <div className="flex gap-1">
              <TaskForm task={task} onSubmit={onEdit} />
              <Button
                variant="destructive"
                size="icon"
                onClick={handleDelete}
                disabled={isDeleting}
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
    </Card>
  );
}