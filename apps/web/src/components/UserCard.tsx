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
}
const UserCard = ({ user }: UserCardProps) => {
  const initials = getInitials(user.name);
  const color = stringToColor(user.name);
  return (
    <div className="flex flex-col justify-between items-center border-solid border-2 border-gray-100 p-8 gap-4">
      <div
        className="rounded-full w-20 h-20 flex justify-center items-center"
        style={{ backgroundColor: color }}
      >
        {initials}
      </div>
      <Typography.Text>{user.name}</Typography.Text>
    </div>
  );
};

export default UserCard;
