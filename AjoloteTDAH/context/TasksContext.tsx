import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Task = {
  id: string;
  title: string;
  completed?: boolean;
};

interface TasksContextType {
  tasks: Task[];
  addTask: (title: string) => void;
  editTask: (id: string, title: string) => void;
  deleteTask: (id: string) => void;
  toggleCompleteTask: (id: string) => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  petName: string;
  setPetName: (name: string) => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);
const TASKS_KEY = 'ajolote_tasks';
const PET_NAME_KEY = 'ajolote_name';

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [petName, setPetNameState] = useState('Axofi');

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(TASKS_KEY);
      if (saved) setTasks(JSON.parse(saved));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks]);

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

  const addTask = (title: string) => {
    setTasks(prev => [...prev, { id: Date.now().toString(), title, completed: false }]);
  };
  const editTask = (id: string, title: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, title } : t));
  };
  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };
  const toggleCompleteTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, editTask, deleteTask, toggleCompleteTask, setTasks, petName, setPetName }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks debe usarse dentro de <TasksProvider>');
  return ctx;
}; 