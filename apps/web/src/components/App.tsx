import { useEffect, useState, useRef } from "react";
import axios from "axios";
import WebSocket from "ws";

type DataProps = {
  data: string;
};

function App() {
  const [data, setData] = useState<DataProps>();
  // const wsRef = useRef<WebSocket>();

  useEffect(() => {
    // if (!wsRef.current) {
    const ws = new WebSocket("ws://localhost:3001");
    // wsRef.current = ws;
    // }
  }, []);

  useEffect(() => {
    const init = async () => {
      const response = await axios.get("http://localhost:3001/");
      setData(response.data);
    };
    init();
  }, []);

  return (
    <div className="App">
      <header className="App-header">Data is: {data?.data}</header>
    </div>
  );
}

export default App;
