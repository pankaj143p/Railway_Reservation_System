import React from "react";

interface DashboardCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  icon,
}) => (
  <div className="bg-white/30 backdrop-blur-lg rounded-xl shadow-md p-6 flex flex-col items-center border border-white/40 hover:scale-105 transition-transform duration-200">
    <div className="text-4xl mb-2">{icon}</div>
    <h2 className="text-lg font-semibold mb-1 text-blue-900">{title}</h2>
    <p className="text-blue-700/80 text-center">{description}</p>
  </div>
);

export default DashboardCard;