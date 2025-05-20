import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./output.css"; // On change "index.css" en "output.css"
import './index.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
