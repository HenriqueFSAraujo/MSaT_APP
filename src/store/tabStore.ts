import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TabStore {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

export const useTabStore = create<TabStore>()(
  persist(
    (set) => ({
      selectedTab: 'personal_data',
      setSelectedTab: (tab) => set({ selectedTab: tab }),
    }),
    {
      name: 'tab-store',
    }
  )
);
