import { Task } from './types';
import { getAuthToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export async function getTasks() {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Non authentifié');
  }
  
  const response = await fetch(`${API_URL}/tasks`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Échec de récupération des tâches');
  }
  
  return response.json();
}

export async function createTask(taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'completed'>, image?: File): Promise<Task> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Non authentifié');
  }
  
  const formData = new FormData();
  
  formData.append('title', taskData.title);
  formData.append('description', taskData.description || '');
  
  if (taskData.due_date) {
    formData.append('due_date', taskData.due_date);
  }
  
  if (image) {
    formData.append('image', image);
  }
  
  console.log("FormData contenu:");
  for (const pair of formData.entries()) {
    console.log(pair[0] + ': ' + pair[1]);
  }
  
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    return(error.message || 'Échec de création de la tâche');
  }
  
  return response.json();
}

export async function updateTask(id: string, taskData: Partial<Task>, image?: File): Promise<Task> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Non authentifié');
  }
  
  // Si une image est fournie, utiliser FormData
  if (image) {
    const formData = new FormData();
    
    if (taskData.title !== undefined) formData.append('title', taskData.title);
    if (taskData.description !== undefined) formData.append('description', taskData.description);
    if (taskData.due_date !== undefined) formData.append('due_date', taskData.due_date);
    if (taskData.completed !== undefined) formData.append('completed', String(taskData.completed));
    
    formData.append('image', image);
    formData.append('_method', 'PUT');
    
    console.log("FormData contenu (update):");
    for (const pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
    
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'POST', // Utiliser POST avec _method=PUT pour le form-method spoofing
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Échec de mise à jour de la tâche');
    }
    
    return response.json();
  } 
  // Sinon, utiliser JSON
  else {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Échec de mise à jour de la tâche');
    }
    
    return response.json();
  }
}

export async function deleteTask(id: string): Promise<void> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Non authentifié');
  }
  
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Échec de suppression de la tâche');
  }
}

export async function getTaskById(id: string): Promise<Task> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Non authentifié');
  }
  
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Échec de récupération de la tâche');
  }
  
  return response.json();
}

export async function fetchWithAuth<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw data;
  }
  
  return data as T;
}

export async function markTaskAsCompleted(id: string, completed: boolean): Promise<Task> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Non authentifié');
  }
  
  try {
    const response = await fetch(`${API_URL}/tasks/${id}/complete`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    });
    
    const data = await response.json();
    
    if (!response.ok || data.success === false) {
      return {
        error: true,
        message: data.message || 'Échec de mise à jour du statut de la tâche'
      } as any;
    }
    
    return data.data;
  } catch (error) {
    return {
      error: true,
      message: 'Erreur de connexion au serveur'
    } as any;
  }
}