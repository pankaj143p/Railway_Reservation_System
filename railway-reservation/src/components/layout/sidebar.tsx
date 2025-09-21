import React from "react";
import { Link, useLocation } from "react-router-dom";

const menu = [
  { icon: "🏠", label: "Dashboard", path: "/" },
  { icon: "👥", label: "Users", path: "/users" },
  { icon: "🚆", label: "Trains", path: "/trains" },
  { icon: "🎫", label: "Tickets", path: "/tickets" },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-white/20 backdrop-blur-md shadow-lg border-r border-white/30 z-20 flex flex-col py-8 px-4">
      <div className="mb-10 text-2xl font-bold text-blue-700 tracking-wide text-center">
        Admin Panel
      </div>
      <nav className="flex flex-col gap-2">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`rounded-lg px-4 py-2 font-medium transition ${
              location.pathname === item.path
                ? "bg-blue-600/80 text-white"
                : "hover:bg-blue-100/60 text-blue-900"
            }`}
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;


