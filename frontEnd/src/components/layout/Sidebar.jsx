import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Sidebar({ menuItems, sidebarOpen, setSidebarOpen }) {
  const sidebarBg = "bg-blue-900";
  const sidebarText = "text-gray-100";
  const hoverBtn = "hover:bg-blue-800 text-gray-100";
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.3 }}
        className={`fixed md:hidden top-0 left-0 h-full w-64 ${sidebarBg} ${sidebarText} flex flex-col z-30 shadow-lg`}
      >
        <div className="flex justify-between items-center p-4 border-b border-white/20">
          <h2 className="text-lg font-bold tracking-wide">NCCF Admin</h2>
          <button className="text-gray-100" onClick={() => setSidebarOpen(false)}>
            ✕
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-2 relative">
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={`/dashboard/${item.id}`}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `relative z-10 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  !isActive ? hoverBtn : ""
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-lg bg-blue-700 z-0"
                      initial={false}
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          className="m-3 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 shadow text-sm font-semibold transition-all duration-150"
          onClick={handleLogout}
        >
          Logout
        </button>
      </motion.aside>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex md:flex-col md:w-56 ${sidebarBg} ${sidebarText} border-r border-white/20 shadow-lg`}
      >
        <h2 className="text-lg font-bold pt-5 pb-4 pl-4 border-b border-white/20 tracking-wide">
          NCCF Admin
        </h2>

        <nav className="flex-1 p-3 space-y-2 relative">
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={`/dashboard/${item.id}`}
              className={({ isActive }) =>
                `relative z-10 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  !isActive ? hoverBtn : ""
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-lg bg-blue-700 z-0"
                      initial={false}
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          className="cursor-pointer m-3 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 shadow text-sm font-semibold transition-all duration-150"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>
    </>
  );
}
