import { devtools, persist } from "zustand/middleware";

import create from "zustand";

interface UserState {
  name: string;
  id: string;
  setState: (name?: string, id?: string) => void;
}

const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        name: "",
        id: "",
        setState(name, id) {
          set((state) => ({
            name: name || state.name,
            id: id || state.id,
          }));
        },
      }),
      {
        name: "user-storage",
      }
    )
  )
);

export default useUserStore;
