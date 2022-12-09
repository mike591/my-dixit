import { GameState, UserType } from "hooks/useGame";
import { Input, Modal } from "antd";

import Card from "components/Card";
import GameCardsDisplay from "components/GameCardsDisplay";
import { useState } from "react";

type ActiveUserGameProps = {
  currentUser: UserType;
  round: GameState["round"];
  game: GameState["game"];
};
const ActiveUserGame = ({ currentUser, round, game }: ActiveUserGameProps) => {
  const [prompt, setPrompt] = useState("");
  const [card, setCard] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleSetCard(cardNum: string) {
    setCard(cardNum);
    setIsModalOpen(true);
  }

  function handleConfirm() {
    console.log("You good!");
  }

  function handleCancel() {
    setPrompt("");
    setIsModalOpen(false);
  }

  return (
    <div>
      <Modal
        title="Enter a prompt"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleConfirm}
        okText="Confirm"
        okButtonProps={{ disabled: !prompt }}
      >
        <div className="flex flex-col items-center gap-4">
          {card && <Card cardNum={card} />}
          <Input
            placeholder="Enter prompt"
            onChange={(e) => setPrompt(e.currentTarget.value)}
            value={prompt}
          />
        </div>
      </Modal>
      <GameCardsDisplay hand={currentUser.hand} onClick={handleSetCard} />
    </div>
  );
};

export default ActiveUserGame;
