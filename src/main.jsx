import ReactDOM from "react-dom/client";
import App from "./App";
import { DashboardProvider } from "./context/DashboardContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <DashboardProvider>
    <App />
  </DashboardProvider>
);
