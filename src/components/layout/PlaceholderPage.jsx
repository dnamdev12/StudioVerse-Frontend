import React from "react";

const PlaceholderPage = ({ title }) => (
  <div>
    <h1 className="app-page-title">{title}</h1>
    <p className="app-page-empty">No {title.toLowerCase()} yet.</p>
  </div>
);

export default PlaceholderPage;
