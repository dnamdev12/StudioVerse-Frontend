import React from "react";
import { getUser } from "../../auth";

const Dashboard = () => {
  const user = getUser();

  return (
    <div>
      <h1 className="app-page-title">Dashboard</h1>
      {user && (
        <p>
          Welcome, {user.firstName} {user.lastName}
        </p>
      )}
    </div>
  );
};

export default Dashboard;
