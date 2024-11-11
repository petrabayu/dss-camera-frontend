import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const handleStartCalculation = () => {
    navigate("/comparison"); // Arahkan ke halaman perhitungan SPK atau halaman perbandingan
  };
  return (
    <div className="flex flex-col items-center justify-center h-full text-center bg-gray-100 p-8">
      <div className="bg-white shadow-md rounded-lg p-12 max-w-xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to DSS Camera Selection</h1>
        <p className="text-gray-600 mb-8">
          Use this application to find the best camera that meets your needs. Start by comparing cameras based on
          important criteria.
        </p>
        <button
          onClick={handleStartCalculation}
          className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 transition-colors"
        >
          Start Calculation
        </button>
      </div>
    </div>
  );
};

export default HomePage;
