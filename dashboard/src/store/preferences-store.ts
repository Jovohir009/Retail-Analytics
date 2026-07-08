'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferencesState {
  language: string;
  compactCharts: boolean;
  setLanguage: (language: string) => void;
  setCompactCharts: (value: boolean) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      language: 'English',
      compactCharts: false,
      setLanguage: (language) => set({ language }),
      setCompactCharts: (value) => set({ compactCharts: value })
    }),
    { name: 'retail-analytics-preferences' }
  )
);
