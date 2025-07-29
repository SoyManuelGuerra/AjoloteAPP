import { useEffect } from 'react';
import { router } from 'expo-router';

export default function AddTaskScreen() {
  useEffect(() => {
    // Redirigir inmediatamente a la pantalla de tareas
    router.replace('/(tabs)/tasks');
  }, []);

  return null;
} 