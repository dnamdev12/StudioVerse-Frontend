import React from "react";
import { Link } from "react-router-dom";
import "./logo.css";

export const APP_NAME = "StudioVerse";

const Logo = ({ to = "/" }) => (
  <Link to={to} className="logo" aria-label={`${APP_NAME} home`}>
    STUDIO<span className="logo-accent">VERSE</span>
  </Link>
);

export default Logo;
