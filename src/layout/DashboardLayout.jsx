import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar.jsx";

import NavBar from "../components/NavBar.jsx";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />

      <div className="flex flex-col flex-1">
        <NavBar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
