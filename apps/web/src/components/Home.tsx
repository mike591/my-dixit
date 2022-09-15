import { Button, Divider, Input, Spin } from "antd";
import { useCallback, useState } from "react";

import Logo from "assets/Logo";
import axios from "axios";
import useUser from "hooks/useUser";

const useCreateGame = () => {
  const [loading, setLoading] = useState(false);
  const { id } = useUser();

  const createGame = useCallback(
    async function () {
      setLoading(true);
      const url = `http://${process.env.REACT_APP_API_DOMAIN}/game`;
      const response = await axios({
        method: "POST",
        url,
        headers: {
          user_id: id,
        },
      });
      console.log({ response });
      setLoading(false);
    },
    [id]
  );

  return {
    loading,
    createGame,
  };
};

const Home: React.FC = () => {
  const [gameKey, setGameKey] = useState("");
  const { loading, createGame } = useCreateGame();

  const handleJoinGame = async () => {
    console.log("Joining game", gameKey);
  };

  const handleCreateGame = async () => {
    await createGame();
  };

  const handleUpdateGameKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGameKey(e.target.value);
  };

  return (
    <Spin spinning={loading}>
      <div className="h-full flex flex-col items-center gap-4">
        <Logo className="mt-12 mb-4" />
        <Button type="primary" onClick={handleCreateGame}>
          New Game
        </Button>
        <Divider />
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Game key"
            onChange={handleUpdateGameKey}
            value={gameKey}
          />
          <Button type="primary" onClick={handleJoinGame}>
            Join Game
          </Button>
        </div>
      </div>
    </Spin>
  );
};

export default Home;
