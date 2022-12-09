import Card from "./Card";
import { UserType } from "hooks/useGame";

type GameCardsDisplayProps = {
  hand: UserType["hand"];
};
const GameCardsDisplay = ({ hand }: GameCardsDisplayProps) => {
  return (
    <div className="flex flex-wrap justify-start gap-4">
      {hand.map((num) => (
        <Card cardNum={num} key={num} />
      ))}
    </div>
  );
};

export default GameCardsDisplay;
