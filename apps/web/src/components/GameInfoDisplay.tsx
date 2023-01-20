import UserCard from "./UserCard";
import { Typography } from "antd";
import useGame, { GameState } from "hooks/useGame";
import useUser from "hooks/useUser";
import "styles/GameInfoDisplay.css";
import getGameKeyFromLocation from "utils/getGameKeyFromLocation";

type DisplayTextProps = {
  users: NonNullable<GameState["users"]>;
  round: NonNullable<GameState["round"]>;
  currentUserId: string;
};
function getDisplayText({ users, round, currentUserId }: DisplayTextProps) {
  const activeUser = round && users?.[round.activeUserId];
  const currentUser = users?.[currentUserId];

  if (round?.gameStage === 0) {
    return `Waiting for ${
      activeUser?.name || "the active user"
    } to select a card and prompt`;
  } else if (round?.gameStage === 1) {
    const isSubmitted = Boolean(currentUser?.submittedCardNum);
    return isSubmitted || round.activeUserId === currentUserId
      ? "Waiting for other players to pick a card..."
      : "Please select a card to trick other players with...";
  } else if (round?.gameStage === 2) {
    const isSelected = Boolean(currentUser?.guessedCardNum);
    return isSelected || round.activeUserId === currentUserId
      ? "Waiting for other players to pick a card..."
      : "Please guess the active player's card...";
  } else {
    return "Waiting for players to ready up for next round...";
  }
}

const GameInfoDisplay = () => {
  const gameKey = getGameKeyFromLocation();
  const { id } = useUser();
  const { users, round } = useGame({ gameKey, userId: id });
  if (!users || !round) return <div>Loading...</div>;

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
          {getDisplayText({ users, round, currentUserId: id })}
        </Typography>
      </div>
    </div>
  );
};

export default GameInfoDisplay;
