import React from "react";
import { useNavigate } from "react-router-dom";
import { clearSession, getUser } from "../../auth";

const Dashboard = () => {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {user && <p>Welcome, {user.firstName} {user.lastName}</p>}
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
