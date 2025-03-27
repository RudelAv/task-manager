'use client';

import { Task } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import Image from 'next/image';
import { Calendar, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  currentUserId: string;
  onComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, currentUserId, onComplete, onDelete, onEdit }: TaskCardProps) {
  const isOwner = task.userId === currentUserId;
  const isOverdue = new Date(task.dueDate) < new Date();

  return (
    <Card className={`w-full ${isOverdue && !task.completed ? 'border-red-500' : ''}`}>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{task.title}</CardTitle>
          {isOwner && (
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => onEdit(task)}>
                <Calendar className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => onDelete(task.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {task.imageUrl && (
          <div className="relative w-full h-48 rounded-md overflow-hidden">
            <Image
              src={task.imageUrl}
              alt={task.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <p className="text-muted-foreground">{task.description}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {format(new Date(task.dueDate), 'PPP')}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        {isOwner && (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={task.completed}
              onCheckedChange={(checked) => onComplete(task.id, checked as boolean)}
            />
            <span>Marquer comme terminée</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}