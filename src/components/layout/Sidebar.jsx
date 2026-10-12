import React from "react";
import { NavLink } from "react-router-dom";
import { MENU_ITEMS } from "./menu";

const Sidebar = ({ open, onNavigate }) => (
  <aside className={`app-sidebar ${open ? "is-open" : ""}`}>
    <nav>
      {MENU_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={onNavigate}
          className={({ isActive }) => `app-nav-link ${isActive ? "is-active" : ""}`}
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
