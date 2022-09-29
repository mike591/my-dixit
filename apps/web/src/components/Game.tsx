import useGame, { GameState } from "hooks/useGame";

import Setup from "./Setup";
import getGameKeyFromLocation from "utils/getGameKeyFromLocation";
import useUser from "hooks/useUser";

function getGameComponent({
  game,
  users,
  round,
}: {
  game: GameState["game"];
  users: GameState["users"];
  round: GameState["round"];
}) {
  if (!game) {
    return <div>Loading...</div>;
  }

  if (!game.isStarted) {
    return <Setup game={game} users={users} />;
  }

  return <div>hi</div>;
}

const Game = () => {
  const gameKey = getGameKeyFromLocation();
  const { id } = useUser();

  const { game, users, round } = useGame({ gameKey, userId: id });

  const Component = getGameComponent({ game, users, round });

  return <div>{Component}</div>;
};

export default Game;
