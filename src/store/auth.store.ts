import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthStore {
  user: User | null;
  isAuth: boolean;
  login: (user: User) => void;
  logout: () => void;
  deleteStore: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      logout: () =>
        set({
          user: null,
          isAuth: false,
        }),
      login: (user: User) =>
        set({
          isAuth: true,
          user,
        }),
      isAuth: false,
      deleteStore: () => {},
    }),
    {
      name: "AuhtStore33",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
