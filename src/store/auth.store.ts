import { Roles } from "@/enums/auth.enum";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  foto_rul: string;
  role: Roles;
}

interface AuthStore {
  user: User | null;
  isAuth: boolean;
  token: string | null;
  login: (user: User) => void;
  logout: () => void;
  deleteStore: () => void;
  setToken: (token: string) => void;
  DeleteToken: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setToken: (token: string) =>
        set({
          token,
        }),
      DeleteToken: () =>
        set({
          token: null,
        }),
      logout: () =>
        set({
          user: null,
          isAuth: false,
          token: null,
        }),
      login: (user: User) =>
        set({
          isAuth: true,
          user,
        }),
      isAuth: false,
      deleteStore: () => {
        useAuthStore.persist.clearStorage();
      },
    }),
    {
      name: "AuhtStore33",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
