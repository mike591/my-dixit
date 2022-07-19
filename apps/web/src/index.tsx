import "./index.css";
import "antd/dist/antd.css";

import App from "components/App";
import React from "react";
import ReactDOM from "react-dom/client";
// import { Provider } from "react-redux";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
