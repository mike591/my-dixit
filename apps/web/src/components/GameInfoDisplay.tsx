import "styles/GameInfoDisplay.css";

import useGame, { GameState } from "hooks/useGame";

import { Typography } from "antd";
import UserCard from "./UserCard";
import getGameKeyFromLocation from "utils/getGameKeyFromLocation";
import useUser from "hooks/useUser";

type DisplayTextProps = {
  users: GameState["users"];
  round: GameState["round"];
};
function getDisplayText({ users, round }: DisplayTextProps) {
  if (round?.gameStage === 0) {
    const activeUser = users?.[round.activeUserId];
    return `Waiting for ${
      activeUser?.name || "the active user"
    } to select a card and prompt`;
  } else if (round?.gameStage === 1) {
    return "Waiting for other players to pick a card...";
  } else if (round?.gameStage === 2) {
    return "Waiting for everyone to vote...";
  } else {
    return "Waiting for players to ready up for next round...";
  }
}

const GameInfoDisplay = () => {
  const gameKey = getGameKeyFromLocation();
  const { id } = useUser();
  const { users, round } = useGame({ gameKey, userId: id });

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto">
        {Object.entries(users || {}).map(([userId, user]) => (
          <div key={userId} className="h-full">
            <UserCard user={user} isGameDisplay />
            <Typography className="text-center">
              {user.points}
              {user.pointsGained && (
                <span className="text-green-400 ml-1">
                  +{user.pointsGained}
                </span>
              )}
            </Typography>
          </div>
        ))}
      </div>
      <hr className="mt-4 mb-4" />
      <div className="w-full overflow-hidden border-2 border-gray-200">
        <Typography className="slide-right-to-left">
          {getDisplayText({ users, round })}
        </Typography>
      </div>
    </div>
  );
};

export default GameInfoDisplay;
