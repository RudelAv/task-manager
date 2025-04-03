"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Plus, Loader2 } from "lucide-react";
import { EditModal } from "./editordeletemodel";
import { Task } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { createTask, getTasks } from "@/lib/api";
import { TaskForm } from "./task-form";
import { TaskForm2 } from "./task-form-2";

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

interface ApiTask {
    id: number;
    title: string;
    description: string;
    type: string;
    image_path: string;
    due_date: string;
    completed: boolean;
    user_id: number;
    created_at: string;
    updated_at: string;
}

interface NewDesignTaskProps {
    currentUserId: string;
}

export function NewDesign({ currentUserId }: NewDesignTaskProps) {
    const [openEditModal, setIsEditModalOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [openAddModal, setIsAddModalOpen] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const response = await getTasks() as PaginatedResponse<ApiTask>;

            if (response.success) {
                const formattedTasks: Task[] = response.data.data.map(apiTask => ({
                    id: apiTask.id.toString(),
                    title: apiTask.title,
                    description: apiTask.description,
                    type: apiTask.type,
                    imageUrl: apiTask.image_path ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${apiTask.image_path}` : '',
                    due_date: new Date(apiTask.due_date).toISOString().split('T')[0],
                    completed: apiTask.completed,
                    userId: apiTask.user_id.toString(),
                    createdAt: apiTask.created_at
                }));

                setTasks(formattedTasks);
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    const formatDate = () => {
        const now = new Date();
        const day = now.getDate();
        const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const month = monthNames[now.getMonth()];
        const year = now.getFullYear();
        const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        const dayName = dayNames[now.getDay()];

        return { day, month, year, dayName };
    };

    const dateInfo = formatDate();

    function handleEdit(data: Partial<Task>, image?: File | undefined): Promise<void> {
        throw new Error("Function not implemented.");
    }

    return (
        <Card className="w-full overflow-hidden shadow-none relative bg-white rounded-none border-1 border-gray-200">
            <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center w-full">
                    <div className="flex flex-col items-center">
                        <div className="text-5xl font-bold text-gray-700">{dateInfo.day}</div>
                        <div className="text-md font-medium text-gray-500">{dateInfo.month}</div>
                        <div className="text-xs text-gray-400">{dateInfo.year}</div>
                    </div>
                    <div className="text-md text-gray-500 uppercase tracking-wide">
                        {dateInfo.dayName}
                    </div>
                </CardTitle>

            </CardHeader>
            <CardContent className="pt-4 pb-12 relative">
                {tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-none">
                        <span className={`text-sm ${task.completed ? "text-gray-400" : "text-gray-600"}`}>
                            {task.title} ({task.type})
                        </span>
                        <Checkbox
                            onCheckedChange={() => {
                                setSelectedTaskId(task.id);
                                setIsEditModalOpen(true);
                            }}
                            checked={task.completed}
                            className={`h-5 w-5 rounded-full border transition-colors duration-200
        ${task.completed ? "bg-green-500 border-green-500 text-white" : "border-gray-300 bg-white"}`}
                        />
                    </div>
                ))}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                    <button
                        className="bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-md hover:bg-teal-600 transition-colors"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                </div>
            </CardContent>
            {openEditModal && selectedTaskId && (
                <EditModal
                    task={tasks.find(t => t.id === selectedTaskId)}
                    taskId={selectedTaskId}
                    open={openEditModal}
                    onOpenChange={setIsEditModalOpen}
                />
            )}

            {openEditModal && (
                <TaskForm2 
                    onSubmit={handleEdit} 
                    open={openAddModal}
                    onOpenChange={setIsAddModalOpen}
              />
            )}
        </Card>
    )
}
