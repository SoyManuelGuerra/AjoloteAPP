import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PointsContextType {
  points: number;
  addPoints: (amount: number) => void;
  setPoints: (amount: number) => void;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);
const POINTS_KEY = 'ajolote_points';

export const PointsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [points, setPointsState] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(POINTS_KEY);
      if (saved) setPointsState(Number(saved));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(POINTS_KEY, points.toString());
  }, [points]);

  const addPoints = (amount: number) => {
    setPointsState(prev => prev + amount);
  };

  const setPoints = (amount: number) => {
    setPointsState(amount);
  };

  return (
    <PointsContext.Provider value={{ points, addPoints, setPoints }}>
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => {
  const ctx = useContext(PointsContext);
  if (!ctx) throw new Error('usePoints debe usarse dentro de <PointsProvider>');
  return ctx;
}; 