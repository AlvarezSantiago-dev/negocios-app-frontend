import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import AuthInitializer from "./context/AuthInitializer";
import { DashboardProvider } from "./context/DashboardContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthInitializer>
    <DashboardProvider>
      <App />
    </DashboardProvider>
  </AuthInitializer>
);
