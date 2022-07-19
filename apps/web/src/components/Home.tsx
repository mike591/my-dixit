import { Button, Divider, Input } from "antd";

import Logo from "assets/Logo";

const Home: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center gap-4">
      <Logo className="mt-12 mb-4" />
      <Button type="primary">New Game</Button>
      <Divider />
      <div className="flex flex-col gap-2">
        <Input placeholder="Game key" />
        <Button type="primary">Join Game</Button>
      </div>
    </div>
  );
};

export default Home;
