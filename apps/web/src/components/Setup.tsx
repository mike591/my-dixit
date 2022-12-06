import { Button, Input, Select, Spin, Typography } from "antd";
import { FIRST_TO_POINTS_GAME_MODE, ROUNDS_GAME_MODE } from "utils/constants";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { GameState } from "hooks/useGame";
import UserCard from "./UserCard";
import axios from "axios";
import { useState } from "react";
import useUser from "hooks/useUser";

const { Option } = Select;
const DEFAULT_NUM_POINTS = 21;

type GameMode = typeof ROUNDS_GAME_MODE | typeof FIRST_TO_POINTS_GAME_MODE;

interface StartGameProps {
  gameMode: GameMode;
  game: GameState["game"];
  numPoints: number;
}
const useStartGame = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const { id } = useUser();

  async function startGame({ gameMode, game, numPoints }: StartGameProps) {
    setLoading(true);
    try {
      const url = `http://${process.env.REACT_APP_API_DOMAIN}/game/${game?.gameKey}/start`;
      await axios({
        method: "POST",
        url,
        headers: {
          user_id: id,
        },
        data: {
          gameMode,
          numPoints,
        },
      });
    } catch (err: unknown) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    startGame,
  };
};

interface ControlsProps {
  game: GameState["game"];
}
const Controls = ({ game }: ControlsProps) => {
  const [gameMode, setGameMode] = useState<GameMode>(FIRST_TO_POINTS_GAME_MODE);
  const [copied, setCopied] = useState(false);

  const { startGame, loading } = useStartGame();

  function handleSetGameMode(value: GameMode) {
    setGameMode(value);
  }

  function handleSetCopied() {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  async function handleStart() {
    await startGame({ gameMode, game, numPoints: DEFAULT_NUM_POINTS });
  }

  return (
    <Spin spinning={loading}>
      <div className="grid gap-4 grid-cols-2">
        <div className="flex flex-col gap-2">
          <Select
            defaultValue={FIRST_TO_POINTS_GAME_MODE}
            onChange={handleSetGameMode}
          >
            <Option value={FIRST_TO_POINTS_GAME_MODE} disabled>
              First to points
            </Option>
          </Select>
          <Select defaultValue={DEFAULT_NUM_POINTS} disabled>
            <Option value={DEFAULT_NUM_POINTS}>{DEFAULT_NUM_POINTS}</Option>
          </Select>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <div className="flex gap-2 items-center">
            <Typography.Text>Game key:</Typography.Text>
            <div className="flex">
              <Input placeholder="Points" value={game?.gameKey} disabled />
              <CopyToClipboard
                text={game?.gameKey || ""}
                onCopy={handleSetCopied}
              >
                <Button>{copied ? "Copied" : "Copy"}</Button>
              </CopyToClipboard>
            </div>
          </div>
          <Button type="primary" className="w-28" onClick={handleStart}>
            Start Game
          </Button>
        </div>
      </div>
    </Spin>
  );
};

interface SetupProps {
  game: GameState["game"];
  users: GameState["users"];
}
const Setup = ({ game, users }: SetupProps) => {
  const { id } = useUser();
  const user = users?.[id];

  return (
    <div className="flex flex-col gap-4">
      {user?.isAdmin && <Controls game={game} />}
      {!user?.isAdmin && (
        <Typography.Title className="flex justify-center">
          Waiting for game to start...
        </Typography.Title>
      )}
      <hr className="mt-4 mb-4" />
      <div className="grid grid-cols-5 gap-4">
        {Object.entries(users || {}).map(([userId, user]) => (
          <UserCard key={userId} user={user} />
        ))}
      </div>
    </div>
  );
};

export default Setup;
