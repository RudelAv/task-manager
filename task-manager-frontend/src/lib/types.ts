export interface Task {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    due_date: string;
    type?: string;
    completed: boolean;
    userId: string;
    createdAt: string;
  }
  
  export interface User {
    id: string;
    email: string;
    name: string;
  }