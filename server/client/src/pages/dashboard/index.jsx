import Sidebar from "../../components/Sidebar";
import { useState } from "react";

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-screen bg-[#F6F6F6] flex">
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-black mb-4">Dashboard</h1>
        <p className="text-[#767C8C]">Dashboard content will be here...</p>
      </div>
    </div>
  );
};

export default Dashboard;