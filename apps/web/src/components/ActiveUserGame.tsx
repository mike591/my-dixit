import { Input, Modal, Spin } from "antd";
import axios from "axios";
import Card from "components/Card";
import GameCardsDisplay from "components/GameCardsDisplay";
import useGame, { GameState, UserType } from "hooks/useGame";
import useUser from "hooks/useUser";
import { useState } from "react";
import getGameKeyFromLocation from "utils/getGameKeyFromLocation";

interface InitializeGameProps {
  cardNum: string;
  prompt: string;
}
const useInitializeGame = ({ game }: { game: GameState["game"] }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const { id } = useUser();

  async function initRound({ cardNum, prompt }: InitializeGameProps) {
    setLoading(true);
    try {
      const url = `http://${process.env.REACT_APP_API_DOMAIN}/game/${game?.gameKey}/init-round`;
      await axios({
        method: "POST",
        url,
        headers: {
          user_id: id,
        },
        data: {
          cardNum,
          prompt,
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
    initRound,
  };
};

type ActiveUserGameProps = {
  currentUser: UserType;
};
const ActiveUserGame = ({ currentUser }: ActiveUserGameProps) => {
  const gameKey = getGameKeyFromLocation();
  const { id } = useUser();
  const { game, users, round } = useGame({ gameKey, userId: id });
  if (!game || !users || !round) return null;

  const [prompt, setPrompt] = useState("");
  const [cardNum, setCardNum] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { initRound, loading } = useInitializeGame({ game });

  function handleSetCard(cardNum: string) {
    setCardNum(cardNum);
    setIsModalOpen(true);
  }

  function handleConfirm() {
    if (cardNum && prompt) {
      initRound({ cardNum, prompt });
    }
  }

  function handleCancel() {
    setPrompt("");
    setIsModalOpen(false);
  }

  return (
    <Spin spinning={loading}>
      <Modal
        title="Enter a prompt"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleConfirm}
        okText="Confirm"
        okButtonProps={{ disabled: !prompt }}
      >
        <div className="flex flex-col items-center gap-4">
          {cardNum && <Card cardNum={cardNum} />}
          <Input
            placeholder="Enter prompt"
            onChange={(e) => setPrompt(e.currentTarget.value)}
            value={prompt}
          />
        </div>
      </Modal>
      <GameCardsDisplay
        hand={currentUser.hand}
        onClick={handleSetCard}
        activeCardNum={round.currentCardNum}
      />
    </Spin>
  );
};

export default ActiveUserGame;
