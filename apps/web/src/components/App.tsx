import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

import Game from "components/Game";
import Header from "components/Header";
import Home from "components/Home";
import axios from "axios";

const App = () => {
  const [user, setUser] = useState();

  async function handleCreateAndSetUser() {
    const userResponse = await axios.post(`http://localhost:3001/user`);
    localStorage.setItem("userId", userResponse.data.id);
    setUser(userResponse.data);
  }

  async function handleGetAndSetUser(userId: string) {
    const userResponse = await axios.get(
      `http://localhost:3001/user/${userId}`
    );
    setUser(userResponse.data);
  }

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      handleCreateAndSetUser();
    } else {
      handleGetAndSetUser(userId);
    }
  }, []);

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
