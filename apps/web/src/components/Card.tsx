type CardProps = {
  cardNum: string;
  onClick?: (cardNum: string) => void;
  highlight?: boolean;
};

const Card = ({ cardNum, onClick, highlight }: CardProps) => {
  const handleClick = onClick ? () => onClick(cardNum) : () => null;
  return (
    <div
      onClick={handleClick}
      className={`w-40 ${onClick ? "cursor-pointer" : ""} ${
        highlight ? "border-4 border-green-500" : ""
      }`}
    >
      <img src={require(`assets/cards/${cardNum}.jpg`)} />
    </div>
  );
};

export default Card;
