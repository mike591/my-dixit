import { useEffect, useState } from "react";
import axios from "axios";

type DataProps = {
  data: string;
};

function App() {
  const [data, setData] = useState<DataProps>();

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
