import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const handleStartCalculation = () => {
    // Kosongkan local storage
    localStorage.removeItem("selectedCameras");
    localStorage.removeItem("mainCriteriWeight");
    navigate("/choose-camera"); // Arahkan ke halaman perhitungan SPK atau halaman perbandingan
  };
  return (
    <div className="flex flex-col items-center justify-center h-full text-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-12 max-w-xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Selamat Datang di SPK Pemilihan Kamera</h1>
        <p className="text-gray-600 mb-8">
          Gunakan aplikasi ini untuk menemukan kamera terbaik yang sesuai dengan kebutuhan Anda. Mulailah dengan
          membandingkan kamera berdasarkan kriteria penting.
        </p>
        <button
          onClick={handleStartCalculation}
          className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 transition-colors"
        >
          Mulai Perhitungan
        </button>
      </div>
    </div>
  );
};

export default HomePage;
