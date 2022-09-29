import { Button, Input, Select, Typography } from "antd";
import { FIRST_TO_POINTS_GAME_MODE, ROUNDS_GAME_MODE } from "utils/constants";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { GameState } from "hooks/useGame";
import { useState } from "react";
import useUser from "hooks/useUser";

const { Option } = Select;

interface ControlsProps {
  game: GameState["game"];
}
const Controls = ({ game }: ControlsProps) => {
  const [gameMode, setGameMode] = useState(FIRST_TO_POINTS_GAME_MODE);
  const [copied, setCopied] = useState(false);

  function handleSetGameMode(
    value: typeof FIRST_TO_POINTS_GAME_MODE | typeof ROUNDS_GAME_MODE
  ) {
    setGameMode(value);
  }

  function handleSetCopied() {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
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
        <Select defaultValue="21" disabled>
          <Option value="21">21</Option>
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
        <Button type="primary" className="w-28">
          Start Game
        </Button>
      </div>
    </div>
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
      <hr />
      <div></div>
    </div>
  );
};

export default Setup;
