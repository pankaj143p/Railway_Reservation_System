import React from "react";
import DashboardCard from "./dashboardcard";
import { useNavigate } from "react-router-dom";

const cards = [
  {
    title: "Users",
    description: "Manage all users in the system.",
    icon: "👥",
    path: "/users",
  },
  {
    title: "Trains",
    description: "View and manage train details.",
    icon: "🚆",
    path: "/trains",
  },
  {
    title: "Tickets",
    description: "Monitor and manage ticket bookings.",
    icon: "🎫",
    path: "/tickets",
  },
  {
    title: "Payments",
    description: "Track all payment transactions.",
    icon: "💳",
    path: "/payments",
  },
];

const DashboardCardsGrid: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
      {cards.map((card) => (
        <div
          key={card.title}
          onClick={() => navigate(card.path)}
          className="cursor-pointer"
        >
          <DashboardCard
            title={card.title}
            description={card.description}
            icon={card.icon}
          />
        </div>
      ))}
    </div>
  );
};

export default DashboardCardsGrid;