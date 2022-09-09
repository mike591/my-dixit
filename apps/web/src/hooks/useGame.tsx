import { devtools, persist } from "zustand/middleware";

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

const useGame = create<GameState>()(
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

export default function (gameKey: string) {
  const { game, user, users, round, setState } = useGame(
    (state) => ({
      game: state.game,
      user: state.user,
      users: state.users,
      round: state.round,
      setState: state.setState,
    }),
    shallow
  );

  // TODO: get server url from env
  const socket = new WebSocket(
    `ws://${process.env.REACT_APP_API_DOMAIN}/game/${gameKey}`
  );

  // Listen for messages
  socket.addEventListener("message", (event) => {
    console.log("Message from server ", event.data);
  });

  return {
    game,
    user,
    users,
    round,
  };
}
