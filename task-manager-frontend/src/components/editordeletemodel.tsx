"use client"

import { Task } from "@/lib/types";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";
import { DialogContent, DialogHeader } from "./ui/dialog";
import { Button } from "./ui/button";
import { deleteTask, markTaskAsCompleted } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface EditmodalProps {
    task?: Task;
    taskId?: string;
    // onSubmit: (data: Partial<Task>) => Promise<void>;
    open?: boolean
    onOpenChange?: (open: boolean) => void;
}

export function EditModal({ task, open, onOpenChange, taskId }: EditmodalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);


    const dialogOpen = open !== undefined ? open : isOpen
    const setDialogOpen = onOpenChange || setIsOpen

    const MarkAsCompleted = async (taskId: string, completed: boolean) => {
        console.log(taskId)
        try {
            const result = await markTaskAsCompleted(taskId, completed);

            if (result.error) {
                toast({
                    title: 'Erreur',
                    description: result.message,
                    variant: 'destructive',
                });
                return;
            }

            setTasks(tasks.map(task =>
                task.id === taskId
                    ? { ...task, completed }
                    : task
            ));

            toast({
                title: 'Succès',
                description: completed
                    ? 'Tâche marquée comme terminée'
                    : 'Tâche marquée comme non terminée',
            });
        } catch (error: any) {
            console.error('Erreur lors de la mise à jour du statut de la tâche:', error);

            toast({
                title: 'Erreur',
                description: typeof error === 'string' ? error : 'Impossible de mettre à jour le statut de la tâche',
                variant: 'destructive',
            });
        }
    }

    const handleDeleteTask = async (taskId: string) => {
        try {
          await deleteTask(taskId);
          
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


    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{"Terminer ou supprimer une tache"}</DialogTitle>
                </DialogHeader>
                <div className="flex justify-end space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => MarkAsCompleted(task?.id, true)}
                    >
                        Termier
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleDeleteTask(task?.id)}
                    >
                        Supprimer
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )

}