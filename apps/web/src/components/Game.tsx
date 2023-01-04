import useGame, { GameState } from "hooks/useGame";

import ActiveUserGame from "components/ActiveUserGame";
import GameCardsDisplay from "components/GameCardsDisplay";
import GameInfoDisplay from "components/GameInfoDisplay";
import GuessersGame from "components/GuessersGame";
import Setup from "components/Setup";
import { Typography } from "antd";
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
  console.log({ users, round, game });

  if (!users) {
    return <div>Loading...</div>;
  }

  const currentUser = users[userId];
  const isActiveUser = round?.activeUserId === userId;

  if (round?.gameStage === 0) {
    return isActiveUser ? (
      <ActiveUserGame currentUser={currentUser} game={game} />
    ) : (
      <GameCardsDisplay hand={currentUser.hand} />
    );
  } else if (round?.gameStage === 1) {
    return (
      <div>
        <Typography.Title className="flex justify-center">
          {round.currentPrompt}
        </Typography.Title>
        {isActiveUser ? (
          <GameCardsDisplay
            hand={currentUser.hand}
            activeCardNum={round.currentCardNum}
          />
        ) : (
          <GuessersGame currentUser={currentUser} game={game} />
        )}
      </div>
    );
  } else if (round?.gameStage === 2) {
    return <div>Time to select the correct card...</div>;
  } else {
    return <div>Game is started</div>;
  }
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
