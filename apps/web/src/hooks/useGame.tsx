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

export default function () {
  const { game, user, users, round } = useGame(
    (state) => ({
      game: state.game,
      user: state.user,
      users: state.users,
      round: state.round,
    }),
    shallow
  );

  return {
    game,
    user,
    users,
    round,
  };
}
