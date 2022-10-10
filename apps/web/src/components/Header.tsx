import { Button, Typography } from "antd";

import { UserOutlined } from "@ant-design/icons";
import useUser from "hooks/useUser";

const Header: React.FC = () => {
  const user = useUser();
  return (
    <div className="border-y border-solid p-4 flex justify-end items-center gap-4">
      <Typography.Text>{user?.name}</Typography.Text>
      <Button type="primary" shape="circle" icon={<UserOutlined />} />
    </div>
  );
};

export default Header;
