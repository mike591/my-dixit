import "./index.css";
import "antd/dist/antd.min.css";

import App from "components/App";
import React from "react";
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
