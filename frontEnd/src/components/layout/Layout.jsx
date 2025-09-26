import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { FiHome, FiUsers, FiSettings } from "react-icons/fi";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: "welcome", label: "Home", icon: <FiHome size={16} /> },
    { id: "users", label: "Users", icon: <FiUsers size={16} /> },
    { id: "settings", label: "Settings", icon: <FiSettings size={16} /> },
  ];

  const currentTitle =
    menuItems.find((m) => location.pathname.includes(m.id))?.label || "Dashboard";

  // Redirect /dashboard to /dashboard/users automatically
  useEffect(() => {
    if (location.pathname === "/dashboard" || location.pathname === "/dashboard/") {
      navigate("/dashboard/users", { replace: true });
    }
  }, [location.pathname, navigate]);

  const pageVariants = {
    initial: { opacity: 0, x: 40, scale: 0.98 },
    animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -40, scale: 0.98, transition: { duration: 0.3 } },
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        menuItems={menuItems}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col">
        <Header title={currentTitle} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-hidden p-4 md:p-6 bg-gray-50 rounded-md shadow-inner min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
