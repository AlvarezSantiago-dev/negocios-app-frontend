import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { DashboardProvider } from "./context/DashboardProvider";
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
