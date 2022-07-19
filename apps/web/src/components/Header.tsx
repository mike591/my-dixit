import { Button } from "antd";
import { UserOutlined } from "@ant-design/icons";

const Header: React.FC = () => {
  return (
    <div className="border-y border-solid p-4 flex justify-end">
      <Button type="primary" shape="circle" icon={<UserOutlined />} />
    </div>
  );
};

export default Header;
