import { devtools, persist } from "zustand/middleware";

import axios from "axios";
import create from "zustand";
import shallow from "zustand/shallow";
import { useEffect } from "react";

interface UserState {
  name: string;
  id: string;
  setState: ({ name, id }: { name?: string; id?: string }) => void;
}

const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        name: "",
        id: "",
        setState({ name, id }) {
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

export default function () {
  const { name, id, setState } = useUserStore(
    (state) => ({
      name: state.name,
      id: state.id,
      setState: state.setState,
    }),
    shallow
  );

  async function handleCreateAndSetUser() {
    const userResponse = await axios.post(`http://localhost:3001/user`);
    localStorage.setItem("userId", userResponse.data.id);
    setState({
      name: userResponse.data.name,
      id: userResponse.data.id,
    });
  }

  async function handleGetAndSetUser(userId: string) {
    const userResponse = await axios.get(
      `http://localhost:3001/user/${userId}`
    );
    setState({
      name: userResponse.data.name,
      id: userResponse.data.id,
    });
  }

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      handleCreateAndSetUser();
    } else {
      handleGetAndSetUser(userId);
    }
  }, []);

  return {
    name,
    id,
  };
}
