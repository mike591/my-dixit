import Card from "./Card";
import { Modal, Spin } from "antd";
import axios from "axios";
import GameCardsDisplay from "components/GameCardsDisplay";
import useGame, { GameState } from "hooks/useGame";
import useUser from "hooks/useUser";
import { SetStateAction, useEffect, useState } from "react";
import getGameKeyFromLocation from "utils/getGameKeyFromLocation";

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

const useGuessCard = ({ game }: { game: GameState["game"] }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const { id } = useUser();

  async function guessCard({ cardNum }: SubmitCardProps) {
    setLoading(true);
    try {
      const url = `http://${process.env.REACT_APP_API_DOMAIN}/game/${game?.gameKey}/guess`;
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
    guessCard,
  };
};

const GuessersGame = () => {
  const gameKey = getGameKeyFromLocation();
  const { id } = useUser();
  const { game, users, round } = useGame({ gameKey, userId: id });
  if (!game || !users || !round) return null;

  const currentUser = users[id];

  const [card, setCard] = useState<string | undefined>();
  const [availableCardsToGuess, setAvailableCardsToGuess] = useState<string[]>(
    []
  );

  function shuffle(cards: any[]): any[] {
    const array = [...cards];

    let currentIndex = array.length,
      randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  useEffect(() => {
    const newAvailableCards: string[] = [];
    Object.entries(users).forEach(([userId, user]) => {
      if (userId !== id && user.submittedCardNum) {
        newAvailableCards.push(user.submittedCardNum);
      }
    });
    newAvailableCards.push(round.currentCardNum);
    shuffle(newAvailableCards);
    setAvailableCardsToGuess(newAvailableCards);
  }, [users]);

  const isGuessingRound = round.gameStage === 2;

  const { submitCard, loading: submitLoading } = useSubmitCard({ game });
  const { guessCard, loading: guessLoading } = useGuessCard({ game });

  const alreadySubmitted = isGuessingRound
    ? currentUser.guessedCardNum
    : currentUser.submittedCardNum;

  function handleSetCard(cardNum: string) {
    setCard(cardNum);
  }

  async function handleConfirm() {
    if (card) {
      const cardCall = isGuessingRound ? guessCard : submitCard;
      await cardCall({ cardNum: card });
      setCard(undefined);
    }
  }

  function handleCancel() {
    setCard(undefined);
  }

  return (
    <Spin spinning={submitLoading || guessLoading}>
      <Modal
        title={`Are you sure you would like to ${
          isGuessingRound ? "guess" : "submit"
        } this card?`}
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
        hand={isGuessingRound ? availableCardsToGuess : currentUser.hand}
        onClick={(!alreadySubmitted && handleSetCard) || undefined}
        activeCardNum={
          isGuessingRound
            ? currentUser.guessedCardNum
            : currentUser.submittedCardNum
        }
      />
    </Spin>
  );
};

export default GuessersGame;
