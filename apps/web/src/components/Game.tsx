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

  const { game, users, round } = useGame({ gameKey, userId: id });

  return <div>Game</div>;
};

export default Game;
