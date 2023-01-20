import { Typography } from "antd";
import ActiveUserGame from "components/ActiveUserGame";
import GameCardsDisplay from "components/GameCardsDisplay";
import GameInfoDisplay from "components/GameInfoDisplay";
import GuessersGame from "components/GuessersGame";
import Setup from "components/Setup";
import useGame, { GameState } from "hooks/useGame";
import useUser from "hooks/useUser";
import getGameKeyFromLocation from "utils/getGameKeyFromLocation";

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

  if (!users || round === undefined) {
    return <div>Loading...</div>;
  }

  const currentUser = users[userId];
  const isActiveUser = round?.activeUserId === userId;

  const adminSelectingCardAndPromptPhase = round?.gameStage === 0;
  const guessersPlayingTheGame = [1, 2].includes(round?.gameStage || -1);

  if (adminSelectingCardAndPromptPhase) {
    return isActiveUser ? (
      <ActiveUserGame currentUser={currentUser} game={game} />
    ) : (
      <GameCardsDisplay hand={currentUser.hand} />
    );
  } else if (guessersPlayingTheGame) {
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
          <GuessersGame />
        )}
      </div>
    );
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
