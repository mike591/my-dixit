import Card from "./Card";
import { UserType } from "hooks/useGame";

type GameCardsDisplayProps = {
  hand: UserType["hand"];
  onClick?: (cardNum: string) => void;
  activeCardNum?: string;
};
const GameCardsDisplay = ({
  hand,
  onClick,
  activeCardNum,
}: GameCardsDisplayProps) => {
  return (
    <div className="flex flex-wrap justify-start gap-4">
      {hand.map((num) => (
        <Card
          cardNum={num}
          key={num}
          onClick={onClick}
          highlight={(activeCardNum && activeCardNum === num) || undefined}
        />
      ))}
    </div>
  );
};

export default GameCardsDisplay;
