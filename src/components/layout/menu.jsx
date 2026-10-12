import React from "react";

const icon = (path) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    {path}
  </svg>
);

export const MENU_ITEMS = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: icon(
      <path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" />,
    ),
  },
  {
    path: "/studios",
    label: "Studios",
    icon: icon(<path d="M3 21V9l9-6 9 6v12M9 21v-6h6v6" />),
  },
  {
    path: "/productions",
    label: "Productions",
    icon: icon(<path d="M4 8h16v12H4zM4 8l3-4h3l-3 4M11 8l3-4h3l-3 4" />),
  },
  {
    path: "/movies",
    label: "Movies",
    icon: icon(
      <path d="M4 4h16v16H4zM8 4v16M16 4v16M4 9h4M4 15h4M16 9h4M16 15h4" />,
    ),
  },
  {
    path: "/serials",
    label: "Serials",
    icon: icon(<path d="M3 7h18v12H3zM8 3l4 4 4-4" />),
  },
  {
    path: "/episodes",
    label: "Episodes",
    icon: icon(<path d="M4 6h16M4 12h16M4 18h10M18 16l3 2-3 2z" />),
  },
  {
    path: "/sets",
    label: "Sets",
    icon: icon(<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5" />),
  },
  {
    path: "/locations",
    label: "Locations",
    icon: icon(
      <path d="M12 21s-7-6.5-7-12a7 7 0 0114 0c0 5.5-7 12-7 12zM12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />,
    ),
  },
];
