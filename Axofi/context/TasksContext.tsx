import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Task = {
  id: string;
  title: string;
  completed?: boolean;
  priority?: 'high' | 'medium' | 'low';
  dueDate?: string; // Fecha de vencimiento
  completedAt?: string; // Fecha cuando se completó
};

interface TasksContextType {
  tasks: Task[];
  completedTasks: Task[];
  addTask: (title: string, priority?: 'high' | 'medium' | 'low', dueDate?: string) => void;
  editTask: (id: string, title: string, priority?: 'high' | 'medium' | 'low', dueDate?: string) => void;
  deleteTask: (id: string) => void;
  toggleCompleteTask: (id: string) => void;
  moveToCompleted: (id: string) => void;
  restoreTask: (id: string) => void;
  deleteCompletedTask: (id: string) => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  petName: string;
  setPetName: (name: string) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);
const TASKS_KEY = 'ajolote_tasks';
const COMPLETED_TASKS_KEY = 'ajolote_completed_tasks';
const PET_NAME_KEY = 'ajolote_name';

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [petName, setPetNameState] = useState('Axofi');

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(TASKS_KEY);
      if (saved) setTasks(JSON.parse(saved));
      
      const savedCompleted = await AsyncStorage.getItem(COMPLETED_TASKS_KEY);
      if (savedCompleted) setCompletedTasks(JSON.parse(savedCompleted));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    AsyncStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(completedTasks));
  }, [completedTasks]);

  // Cargar nombre
  useEffect(() => {
    (async () => {
      const savedName = await AsyncStorage.getItem(PET_NAME_KEY);
      if (savedName) setPetNameState(savedName);
    })();
  }, []);
  // Guardar nombre cuando cambia
  useEffect(() => {
    AsyncStorage.setItem(PET_NAME_KEY, petName);
  }, [petName]);
  const setPetName = (name: string) => setPetNameState(name);

  const addTask = (title: string, priority: 'high' | 'medium' | 'low' = 'medium', dueDate?: string) => {
    setTasks(prev => [...prev, { id: Date.now().toString(), title, completed: false, priority, dueDate }]);
  };
  
  const editTask = (id: string, title: string, priority: 'high' | 'medium' | 'low' = 'medium', dueDate?: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, title, priority, dueDate } : t));
  };
  
  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };
  
  const toggleCompleteTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const moveToCompleted = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const completedTask = {
        ...task,
        completed: true,
        completedAt: new Date().toISOString()
      };
      setCompletedTasks(prev => [...prev, completedTask]);
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const restoreTask = (id: string) => {
    const completedTask = completedTasks.find(t => t.id === id);
    if (completedTask) {
      const restoredTask = {
        ...completedTask,
        completed: false,
        completedAt: undefined
      };
      setTasks(prev => [...prev, restoredTask]);
      setCompletedTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const deleteCompletedTask = (id: string) => {
    setCompletedTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <TasksContext.Provider value={{ 
      tasks, 
      completedTasks,
      addTask, 
      editTask, 
      deleteTask, 
      toggleCompleteTask, 
      moveToCompleted,
      restoreTask,
      deleteCompletedTask,
      setTasks, 
      petName, 
      setPetName 
    }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks debe usarse dentro de <TasksProvider>');
  return ctx;
}; 