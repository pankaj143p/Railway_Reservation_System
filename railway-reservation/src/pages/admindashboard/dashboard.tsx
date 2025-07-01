import React from "react";
import Sidebar from "../../components/layout/sidebar";
import RevenueCard from "../../components/amdin/dashboard/card/revenuecard";
import Carousel from "../../components/amdin/dashboard/Carousel";
import DashboardCardsGrid from "../../components/amdin/dashboard/card/dashboardcardgrid";

const DashboardPage: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex py-16">
    <Sidebar />
    <main className="flex-1 ml-56 px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-blue-900">Admin Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1">
          <RevenueCard />
        </div>
        <div className="lg:col-span-2">
          <Carousel />
        </div>
      </div>
      <DashboardCardsGrid />
    </main>
  </div>
);

export default DashboardPage;