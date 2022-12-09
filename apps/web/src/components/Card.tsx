type CardProps = {
  cardNum: string;
  onClick?: (cardNum: string) => void;
};

const Card = ({ cardNum, onClick }: CardProps) => {
  const handleClick = onClick ? () => onClick(cardNum) : () => null;
  return (
    <div
      onClick={handleClick}
      className={`w-40 ${onClick && "cursor-pointer"}`}
    >
      <img src={require(`assets/cards/${cardNum}.jpg`)} />
    </div>
  );
};

export default Card;
