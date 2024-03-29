import axios from "axios";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import shallow from "zustand/shallow";

export interface UserType {
  name: string;
  points: number;
  pointsGained: number;
  readyToProceed: boolean;
  submittedCardNum: string;
  guessedCardNum: string;
  isAdmin: boolean;
  hand: string[];
}
export interface GameState {
  game?: {
    id: string;
    gameKey: string;
    isStarted: boolean;
    isGameEnd: boolean;
  };
  users?: {
    [key: string]: UserType;
  };
  round?: {
    activeUserId: string;
    currentCardNum: string;
    currentPrompt: string;
    roundNum: number;
    gameStage: number;
  };
  setState: ({
    game,
    users,
    round,
  }: {
    game: GameState["game"];
    users: GameState["users"];
    round: GameState["round"];
  }) => void;
}

const useGameStore = create<GameState>()(
  devtools(
    persist(
      (set) => ({
        setState({ game, users, round }) {
          set({ game, users, round });
        },
      }),
      {
        name: "game-storage",
      }
    )
  )
);

interface UseGame {
  gameKey?: string;
  userId: string;
}
export default function ({ gameKey, userId }: UseGame) {
  const navigate = useNavigate();

  const { game, users, round, setState } = useGameStore(
    (state) => ({
      game: state.game,
      users: state.users,
      round: state.round,
      setState: state.setState,
    }),
    shallow
  );

  // handle sockets
  const currentSocketRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    if (gameKey && !currentSocketRef.current) {
      const socket = new WebSocket(
        `ws://${process.env.REACT_APP_API_DOMAIN}/game?gameKey=${gameKey}`
      );

      // Listen for messages
      socket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        setState(data);
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

  const handleJoinGame = async () => {
    await axios({
      method: "GET",
      url: `http://${process.env.REACT_APP_API_DOMAIN}/game/${gameKey}`,
      headers: {
        user_id: userId,
      },
    }).catch(() => {
      navigate("/game-already-started");
    });
  };

  useEffect(() => {
    if (gameKey) {
      handleJoinGame();
    }
  }, [gameKey]);

  return {
    game,
    users,
    round,
  };
}
