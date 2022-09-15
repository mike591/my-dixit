import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

import Game from "components/Game";
import Header from "components/Header";
import Home from "components/Home";

const App = () => {
  return (
    <div className="App flex justify-center bg-gray-100">
      <div className="bg-white h-screen w-[48rem] flex flex-col">
        <Header />
        <div className="flex flex-col p-6 grow">
          <Routes>
            <Route path="/game/:gameId" element={<Game />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
