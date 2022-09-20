import { devtools, persist } from "zustand/middleware";
import { useEffect, useRef } from "react";

import axios from "axios";
import create from "zustand";
import shallow from "zustand/shallow";

interface GameState {
  game?: {
    id: string;
    gameKey: string;
    isStarted: boolean;
    isGameEnd: boolean;
  };
  user?: {
    submittedCardNum: number;
    selectedCardNum: number;
    isAdmin: boolean;
    hand: number[];
  };
  users?: {
    [key: string]: {
      name: string;
      points: number;
      pointsGained: number;
      readyToProceed: boolean;
    };
  };
  round?: {
    activeUserId: string;
    currentPrompt: string;
  };
  setState: ({
    game,
    user,
    users,
    round,
  }: {
    game: GameState["game"];
    user: GameState["user"];
    users: GameState["users"];
    round: GameState["round"];
  }) => void;
}

const useGameStore = create<GameState>()(
  devtools(
    persist(
      (set) => ({
        setState({ game, user, users, round }) {
          set({ game, user, users, round });
        },
      }),
      {
        name: "game-storage",
      }
    )
  )
);

interface UseGame {
  gameKey: string;
  userId: string;
}
export default function ({ gameKey, userId }: UseGame) {
  const { game, user, users, round, setState } = useGameStore(
    (state) => ({
      game: state.game,
      user: state.user,
      users: state.users,
      round: state.round,
      setState: state.setState,
    }),
    shallow
  );

  // handle sockets
  const currentSocketRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    if (gameKey) {
      const socket = new WebSocket(
        `ws://${process.env.REACT_APP_API_DOMAIN}/game?gameKey=${gameKey}`
      );

      // Listen for messages
      socket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        // TODO save data to state
        console.log(data);
      });

      currentSocketRef.current = socket;
    }

    return () => {
      const socketIsOpen = currentSocketRef.current?.readyState === 1;
      if (socketIsOpen) {
        currentSocketRef.current?.close();
        currentSocketRef.current = null;
      }
    };
  }, [gameKey]);

  const handleGetGame = async () => {
    await axios({
      method: "GET",
      url: `http://${process.env.REACT_APP_API_DOMAIN}/game/${gameKey}`,
      headers: {
        user_id: userId,
      },
    });
  };

  useEffect(() => {
    if (!gameKey) {
      return;
    }

    handleGetGame();
  }, [gameKey]);

  return {
    game,
    user,
    users,
    round,
  };
}
