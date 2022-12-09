type CardProps = {
  cardNum: number;
  callback?: () => void;
};

const Card = ({ cardNum, callback }: CardProps) => {
  return (
    <div onClick={callback} className="w-40">
      <img src={require(`assets/cards/${cardNum}.jpg`)} />
    </div>
  );
};

export default Card;
