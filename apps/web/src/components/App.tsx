import { Route, Routes } from "react-router-dom";

import Game from "components/Game";
import GameAlreadyStarted from "components/GameAlreadyStarted";
import Header from "components/Header";
import Home from "components/Home";

const App = () => {
  return (
    <div className="App flex justify-center bg-gray-100">
      <div className="bg-white h-screen w-[48rem] flex flex-col overflow-y-auto">
        <Header />
        <div className="flex flex-col p-6 grow">
          <Routes>
            <Route path="/game/:gameId" element={<Game />} />
            <Route
              path="/game-already-started"
              element={<GameAlreadyStarted />}
            />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
