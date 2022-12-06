import useGame, { GameState } from "hooks/useGame";

import GameInfoDisplay from "./GameInfoDisplay";
import Setup from "./Setup";
import getGameKeyFromLocation from "utils/getGameKeyFromLocation";
import useUser from "hooks/useUser";

type CurrentGameContentProps = {
  users: GameState["users"];
  round: GameState["round"];
  game: GameState["game"];
  userId: string;
};
function getCurrentGameContent({
  users,
  round,
  game,
  userId,
}: CurrentGameContentProps) {
  if (round?.gameStage === 0) {
    const isActiveUser = round.activeUserId === userId;
    isActiveUser ? <div>You are active</div> : <div>Show cards here</div>;
  }

  return <div>Game is started</div>;
}

const Game = () => {
  const gameKey = getGameKeyFromLocation();
  const { id } = useUser();
  const { game, users, round } = useGame({ gameKey, userId: id });

  if (!game) {
    return <div>Loading...</div>;
  }

  if (!game.isStarted) {
    return <Setup game={game} users={users} />;
  }

  return (
    <div>
      <GameInfoDisplay />
      <hr className="mt-4 mb-4" />
      <div>{getCurrentGameContent({ game, users, round, userId: id })}</div>
    </div>
  );
};

export default Game;
