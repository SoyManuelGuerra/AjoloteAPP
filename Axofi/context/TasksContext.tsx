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
  debugAsyncStorage: () => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

// AsyncStorage keys
const TASKS_KEY = 'ajolote_tasks';
const COMPLETED_TASKS_KEY = 'ajolote_completed_tasks';
const PET_NAME_KEY = 'ajolote_name';

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [petName, setPetNameState] = useState('Axofi');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial data from AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem(TASKS_KEY);
        if (saved) {
          const parsedTasks = JSON.parse(saved);
          console.log('Loaded tasks from AsyncStorage:', parsedTasks.length);
          setTasks(parsedTasks);
        } else {
          console.log('No tasks found in AsyncStorage');
        }
        
        const savedCompleted = await AsyncStorage.getItem(COMPLETED_TASKS_KEY);
        if (savedCompleted) {
          const parsedCompleted = JSON.parse(savedCompleted);
          console.log('Loaded completed tasks from AsyncStorage:', parsedCompleted.length);
          setCompletedTasks(parsedCompleted);
        } else {
          console.log('No completed tasks found in AsyncStorage');
        }
        
        // Marcar como cargado después de cargar todos los datos
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading tasks from AsyncStorage:', error);
        setIsLoaded(true); // Marcar como cargado incluso si hay error
      }
    };
    
    loadData();
  }, []);

  // Persist tasks to AsyncStorage when they change (only after initial load)
  useEffect(() => {
    if (!isLoaded) return; // No guardar durante la carga inicial
    
    const saveData = async () => {
      try {
        await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
        console.log('Tasks saved to AsyncStorage:', tasks.length);
      } catch (error) {
        console.error('Error saving tasks to AsyncStorage:', error);
      }
    };
    
    saveData();
  }, [tasks, isLoaded]);

  // Persist completed tasks to AsyncStorage when they change (only after initial load)
  useEffect(() => {
    if (!isLoaded) return; // No guardar durante la carga inicial
    
    const saveData = async () => {
      try {
        await AsyncStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(completedTasks));
        console.log('Completed tasks saved to AsyncStorage:', completedTasks.length);
      } catch (error) {
        console.error('Error saving completed tasks to AsyncStorage:', error);
      }
    };
    
    saveData();
  }, [completedTasks, isLoaded]);

  // Load pet name from AsyncStorage
  useEffect(() => {
    const loadPetName = async () => {
      try {
        const savedName = await AsyncStorage.getItem(PET_NAME_KEY);
        if (savedName) setPetNameState(savedName);
      } catch (error) {
        console.error('Error loading pet name from AsyncStorage:', error);
      }
    };
    
    loadPetName();
  }, []);
  
  // Persist pet name to AsyncStorage when it changes
  useEffect(() => {
    const savePetName = async () => {
      try {
        await AsyncStorage.setItem(PET_NAME_KEY, petName);
      } catch (error) {
        console.error('Error saving pet name to AsyncStorage:', error);
      }
    };
    
    savePetName();
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
      console.log('Moving task to completed:', completedTask.title);
      setCompletedTasks(prev => {
        const newCompleted = [...prev, completedTask];
        console.log('New completed tasks array length:', newCompleted.length);
        return newCompleted;
      });
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

  // Función de debugging (remover en producción)
  const debugAsyncStorage = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem(TASKS_KEY);
      const savedCompleted = await AsyncStorage.getItem(COMPLETED_TASKS_KEY);
      console.log('=== DEBUG AsyncStorage ===');
      console.log('Tasks in storage:', savedTasks ? JSON.parse(savedTasks).length : 0);
      console.log('Completed tasks in storage:', savedCompleted ? JSON.parse(savedCompleted).length : 0);
      console.log('Tasks in memory:', tasks.length);
      console.log('Completed tasks in memory:', completedTasks.length);
      console.log('isLoaded:', isLoaded);
      console.log('Raw tasks storage:', savedTasks);
      console.log('Raw completed storage:', savedCompleted);
      console.log('========================');
    } catch (error) {
      console.error('Error debugging AsyncStorage:', error);
    }
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
      setPetName,
      debugAsyncStorage
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