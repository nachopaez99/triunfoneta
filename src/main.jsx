import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./styles/variables.css";
import "./styles/global.css";
import "./styles/layout.css";

import "./styles/components/buttons.css";
import "./styles/components/sidebar.css";
import "./styles/components/header.css";
import "./styles/components/stock.css";
import "./styles/components/modal.css";
import "./styles/components/cards.css";
import "./styles/components/sticker.css";


import "./styles/pages/home.css";
import "./styles/pages/album.css";
import "./styles/pages/trivia.css";
import "./styles/pages/prode.css";
import "./styles/pages/exchange.css";
import "./styles/pages/profile.css";
import "./styles/pages/login.css";
import "./styles/pages/info.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);