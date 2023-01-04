import { GameState, UserType } from "hooks/useGame";
import { Modal, Spin } from "antd";

import Card from "./Card";
import GameCardsDisplay from "components/GameCardsDisplay";
import axios from "axios";
import { useState } from "react";
import useUser from "hooks/useUser";

interface SubmitCardProps {
  cardNum: string;
}
const useSubmitCard = ({ game }: { game: GameState["game"] }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const { id } = useUser();

  async function submitCard({ cardNum }: SubmitCardProps) {
    setLoading(true);
    try {
      const url = `http://${process.env.REACT_APP_API_DOMAIN}/game/${game?.gameKey}/submit-card`;
      await axios({
        method: "POST",
        url,
        headers: {
          user_id: id,
        },
        data: {
          cardNum,
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
    submitCard,
  };
};

type GuessersGameProps = {
  currentUser: UserType;
  game: GameState["game"];
};
const GuessersGame = ({ currentUser, game }: GuessersGameProps) => {
  const [card, setCard] = useState<string | undefined>();

  const { submitCard, loading } = useSubmitCard({ game });

  function handleSetCard(cardNum: string) {
    setCard(cardNum);
  }

  async function handleConfirm() {
    if (card) {
      await submitCard({ cardNum: card });
      setCard(undefined);
    }
  }

  function handleCancel() {
    setCard(undefined);
  }

  return (
    <Spin spinning={loading}>
      <Modal
        title="Are you sure you would like to submit this card?"
        open={Boolean(card)}
        onCancel={handleCancel}
        onOk={handleConfirm}
        okText="Confirm"
      >
        <div className="flex flex-col items-center gap-4">
          {card && <Card cardNum={card} />}
        </div>
      </Modal>
      <GameCardsDisplay
        hand={currentUser.hand}
        onClick={handleSetCard}
        activeCardNum={currentUser.submittedCardNum}
      />
    </Spin>
  );
};

export default GuessersGame;
