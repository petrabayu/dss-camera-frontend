// src/components/DashboardLayout.jsx
import { Link, Outlet } from "react-router-dom";
import { FiHome, FiCamera, FiSliders, FiAperture, FiBox, FiBarChart2, FiInfo, FiHelpCircle } from "react-icons/fi";
import Footer from "./Footer";

const DashboardLayout = () => {
  const mainLinks = [
    { path: "/", label: "Beranda", icon: <FiHome /> },
    { path: "/camera-list", label: "Daftar Kamera", icon: <FiCamera /> },
    { path: "/choose-camera", label: "Pilih Kamera", icon: <FiBox /> },
    { path: "/comparison", label: "Perbandingan Berpasangan", icon: <FiSliders /> },
    { path: "/ranking", label: "Peringkat", icon: <FiBarChart2 /> },
  ];

  const bottomLinks = [
    { path: "/how-to-use", label: "Cara Menggunakan", icon: <FiHelpCircle /> },
    { path: "/about", label: "Tentang", icon: <FiInfo /> },
  ];

  return (
    <div className="flex h-screen">
      <aside className="w-72 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-3xl font-bold flex items-center space-x-2">
          <FiAperture />
          <span>SPK Kamera</span>
        </div>
        <nav className="flex-1 flex flex-col justify-between p-4">
          {/* Navigasi Utama */}
          <div className="space-y-4">
            {mainLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="flex items-center py-2 px-4 hover:bg-gray-700 rounded space-x-2"
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
          {/* Navigasi Bawah */}
          <div className="space-y-4">
            {bottomLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="flex items-center py-2 px-4 hover:bg-gray-700 rounded space-x-2"
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </nav>
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
