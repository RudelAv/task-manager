export interface Task {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    dueDate: string;
    completed: boolean;
    userId: string;
    createdAt: string;
  }
  
  export interface User {
    id: string;
    email: string;
    name: string;
  }