import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./layout.css";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`app ${sidebarOpen ? "sidebar-open" : ""}`}>
      <Header onToggleSidebar={() => setSidebarOpen((o) => !o)} />
      <div className="app-body">
        <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
        {sidebarOpen && (
          <div className="app-backdrop" onClick={() => setSidebarOpen(false)} />
        )}
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
