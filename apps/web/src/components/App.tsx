import { useEffect, useRef, useState } from "react";

import Header from "components/Header";
import Home from "components/Home";
import axios from "axios";

type DataProps = {
  data: string;
};

const App: React.FC = () => {
  const [data, setData] = useState<DataProps>();
  // const wsRef = useRef<WebSocket>();

  // useEffect(() => {
  //   if (!wsRef.current) {
  //     const socket = new WebSocket("ws://localhost:3001");
  //     wsRef.current = socket;

  //     socket.addEventListener("open", (event) => {
  //       socket.send("Hello Server!");
  //     });

  //     socket.addEventListener("message", (event) => {
  //       console.log("Message from server ", event.data);
  //     });
  //   }
  // }, []);

  // useEffect(() => {
  //   const init = async () => {
  //     const response = await axios.get("http://localhost:3001/");
  //     setData(response.data);
  //   };
  //   init();
  // }, []);

  return (
    <div className="App flex justify-center bg-gray-100">
      <div className="bg-white h-screen w-[48rem] flex flex-col">
        <Header />
        <div className="flex flex-col p-6 grow">
          <Home />
        </div>
      </div>
    </div>
  );
};

export default App;
