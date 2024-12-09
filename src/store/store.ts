import { create } from 'zustand';

type AuthProps = {
  token: string;
  setToken: (props: string) => void;
};

export const useAuthStore = create<AuthProps>((set) => ({
  token: '',
  setToken: (token) => set({ token }),
}));
