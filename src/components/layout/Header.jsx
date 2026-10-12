import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearSession, getUser } from "../../auth";
import Logo from "../common/Logo";

const Header = ({ onToggleSidebar }) => {
  const user = getUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() || "U";

  return (
    <header className="app-header">
      <div className="app-header-left">
        <button
          type="button"
          className="app-icon-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" width="22" height="22">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Logo to="/dashboard" />
      </div>

      <div className="app-user" ref={menuRef}>
        <button
          type="button"
          className="app-user-btn"
          onClick={() => setMenuOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          <span className="app-avatar">{initials}</span>
          {user && (
            <span className="app-user-name">
              {user.firstName} {user.lastName}
            </span>
          )}
        </button>
        {menuOpen && (
          <div className="app-user-menu" role="menu">
            {user?.email && <p className="app-user-email">{user.email}</p>}
            <button type="button" role="menuitem" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
