// src/components/DashboardLayout.jsx
import { Link, Outlet } from "react-router-dom";
import { FiHome, FiCamera, FiSliders, FiClock, FiAperture } from "react-icons/fi";
import Footer from "./Footer";

const DashboardLayout = () => {
  const navigationLinks = [
    { path: "/", label: "Home Page", icon: <FiHome /> },
    { path: "/camera-list", label: "Camera List", icon: <FiCamera /> },
    { path: "/comparison", label: "Pairwise Comparison", icon: <FiSliders /> },
    { path: "/history", label: "History", icon: <FiClock /> },
  ];

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-3xl font-bold flex items-center space-x-2">
          <FiAperture />
          <span>DSS Camera</span>
        </div>
        <nav className="flex-1 p-4 space-y-4">
          {navigationLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className="flex items-center py-2 px-4 hover:bg-gray-700 rounded space-x-2"
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 rounded">Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1  flex flex-col justify-between">
        <div className="flex-1 p-8 overflow-auto">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default DashboardLayout;
