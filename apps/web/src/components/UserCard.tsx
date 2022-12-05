import { Typography } from "antd";
import { UserType } from "hooks/useGame";

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((name) => name.charAt(0).toUpperCase())
    .join("");
}
interface UserCardProps {
  user: UserType;
  isGameDisplay?: boolean;
}
const UserCard = ({ user, isGameDisplay }: UserCardProps) => {
  const initials = getInitials(user.name);
  const color = stringToColor(user.name);

  const cardSize = isGameDisplay ? "p-2 w-20 h-28" : "p-8 justify-between";
  const iconSize = isGameDisplay ? "w-6 h-6 text-xs" : "w-20 h-20";

  return (
    <div
      className={`flex flex-col items-center border-solid border-2 border-gray-100 gap-4 ${cardSize}`}
    >
      <div
        className={`rounded-full flex justify-center items-center ${iconSize}`}
        style={{ backgroundColor: color }}
      >
        {initials}
      </div>
      <Typography.Text className="text-center text-xs">
        {user.name}
      </Typography.Text>
    </div>
  );
};

export default UserCard;
