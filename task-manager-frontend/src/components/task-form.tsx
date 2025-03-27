'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Upload, X } from 'lucide-react';
import { Task } from '@/lib/types';
import Image from 'next/image';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: Partial<Task>, image?: File) => Promise<void>;
}

export function TaskForm({ task, onSubmit }: TaskFormProps) {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(task?.imageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: task || {
      title: '',
      description: '',
      due_date: new Date().toISOString().split('T')[0],
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      
      // Créer une URL pour prévisualiser l'image
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmitForm = async (data: Partial<Task>) => {
    console.log("Données du formulaire:", data);
    await onSubmit(data, selectedImage || undefined);
    setOpen(false);
    reset();
    setSelectedImage(null);
    setPreviewUrl(null);
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
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Image</label>
            <div className="flex items-center gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                {previewUrl ? 'Changer l\'image' : 'Télécharger une image'}
              </Button>
              {previewUrl && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            
            {previewUrl && (
              <div className="mt-2 relative aspect-video w-full overflow-hidden rounded-md">
                <Image 
                  src={previewUrl} 
                  alt="Aperçu de l'image" 
                  fill
                  className="object-cover"
                />
              </div>
            )}
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
              {...register('due_date', { required: 'La date d\'échéance est requise' })}
              type="date"
            />
            {errors.due_date && (
              <p className="text-sm text-destructive">{errors.due_date.message}</p>
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