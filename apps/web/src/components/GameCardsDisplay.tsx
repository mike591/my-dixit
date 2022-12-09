import Card from "./Card";
import { UserType } from "hooks/useGame";

type GameCardsDisplayProps = {
  hand: UserType["hand"];
  onClick?: (cardNum: string) => void;
};
const GameCardsDisplay = ({ hand, onClick }: GameCardsDisplayProps) => {
  return (
    <div className="flex flex-wrap justify-start gap-4">
      {hand.map((num) => (
        <Card cardNum={num} key={num} onClick={onClick} />
      ))}
    </div>
  );
};

export default GameCardsDisplay;
