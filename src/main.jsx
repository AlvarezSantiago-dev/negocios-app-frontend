import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/print.css";
import { DashboardProvider } from "./context/DashboardProvider";
import AuthInitializer from "./context/AuthInitializer";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthInitializer>
      <DashboardProvider>
        <App />
      </DashboardProvider>
    </AuthInitializer>
  </BrowserRouter>
);
