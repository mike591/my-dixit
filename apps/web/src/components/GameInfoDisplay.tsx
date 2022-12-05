import "styles/GameInfoDisplay.css";

import { Typography } from "antd";
import UserCard from "./UserCard";
import getGameKeyFromLocation from "utils/getGameKeyFromLocation";
import useGame from "hooks/useGame";
import useUser from "hooks/useUser";

const GameInfoDisplay = () => {
  const gameKey = getGameKeyFromLocation();
  const { id } = useUser();
  const { game, users, round } = useGame({ gameKey, userId: id });

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
          Test Test Test Test Test
        </Typography>
      </div>
    </div>
  );
};

export default GameInfoDisplay;
