import useGame from "hooks/useGame";
import { useLocation } from "react-router-dom";
import useUser from "hooks/useUser";

const getGameKeyFromLocation = () => {
  const location = useLocation();
  const path = location.pathname;
  return path.split("/")[2];
};

const Game = () => {
  const gameKey = getGameKeyFromLocation();
  const { id } = useUser();

  const { game, user, users, round } = useGame({ gameKey, userId: id });

  console.log({ game, user, users, round });

  return <div>Game</div>;
};

export default Game;
