import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FormDataByTab } from '@/pages/StudentForm/type.ds';

type TabKey = keyof FormDataByTab;

type ScholarshipFormState = {
  formData: Partial<FormDataByTab>;
  setFormData: <K extends TabKey>(tab: K, values: FormDataByTab[K]) => void;
  clearFormData: () => void;
};

export const useScholarshipFormStore = create<ScholarshipFormState>()(
  persist(
    (set, get) => ({
      formData: {},
      setFormData: (tab, values) => {
        const currentData = get().formData;
        set({ formData: { ...currentData, [tab]: values } });
      },
      clearFormData: () => set({ formData: {} }),
    }),
    {
      name: 'scholarship-form',
      storage: {
        getItem: (key) => {
          const value = sessionStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: (key, value) => sessionStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => sessionStorage.removeItem(key),
      },
    }
  )
);
