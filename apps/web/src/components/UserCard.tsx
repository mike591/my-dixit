import { UserType } from "hooks/useGame";

interface UserCardProps {
  user: UserType;
}
const UserCard = ({ user }: UserCardProps) => {
  return <div>UserCard</div>;
};

export default UserCard;
