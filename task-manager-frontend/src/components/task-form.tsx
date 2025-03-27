'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from 'lucide-react';
import { Task } from '@/lib/types';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: Partial<Task>) => Promise<void>;
}

export function TaskForm({ task, onSubmit }: TaskFormProps) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: task || {
      title: '',
      description: '',
      imageUrl: '',
      dueDate: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmitForm = async (data: Partial<Task>) => {
    await onSubmit(data);
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          {task ? 'Modifier la tâche' : 'Nouvelle tâche'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Modifier la tâche' : 'Créer une nouvelle tâche'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div className="space-y-2">
            <Input
              {...register('title', { required: 'Le titre est requis' })}
              placeholder="Titre de la tâche"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Input
              {...register('imageUrl')}
              placeholder="URL de l'image"
              type="url"
            />
          </div>
          <div className="space-y-2">
            <Textarea
              {...register('description')}
              placeholder="Description de la tâche"
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Input
              {...register('dueDate', { required: 'La date d\'échéance est requise' })}
              type="date"
            />
            {errors.dueDate && (
              <p className="text-sm text-red-500">{errors.dueDate.message}</p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="submit">
              {task ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}