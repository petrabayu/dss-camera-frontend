import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const ChooseCameraPage = () => {
  const [cameras, setCameras] = useState([]);
  const [selectedCameras, setSelectedCameras] = useState(JSON.parse(localStorage.getItem("selectedCameras")) || []);
  const navigate = useNavigate();

  const fetchCameras = async () => {
    try {
      const response = await axiosInstance.get("/cameras");
      setCameras(response.data.data);
    } catch (error) {
      console.error("Error fetching cameras:", error);
    }
  };

  useEffect(() => {
    fetchCameras();
    console.log("Current Selected Camera IDs:", selectedCameras);
  }, [selectedCameras]);

  useEffect(() => {
    localStorage.setItem("selectedCameras", JSON.stringify(selectedCameras));
  }, [selectedCameras]);

  const columns = [
    { key: "camera_name", label: "Camera Name" },
    { key: "price", label: "Price" },
    { key: "pixel", label: "Pixels" },
    { key: "max_resolution_width", label: "Max Res (W)" },
    { key: "max_resolution_length", label: "Max Res (L)" },
    { key: "sensor_size", label: "Sensor Size" },
    { key: "min_iso", label: "ISO Min" },
    { key: "max_iso", label: "ISO Max" },
    { key: "min_shutter_speed", label: "Shutter Min" },
    { key: "max_shutter_speed", label: "Shutter Max" },
    { key: "continues_drive", label: "Cont. Drive" },
    { key: "max_video_resolution_width", label: "Video Res (W)" },
    { key: "max_video_resolution_length", label: "Video Res (L)" },
    { key: "max_video_fps", label: "Video FPS Max" },
    { key: "battery_life", label: "Battery Life" },
    { key: "articulated_lcd", label: "Articulated LCD" },
    { key: "screen_dots", label: "Screen Dots" },
    { key: "weight", label: "Weight" },
  ];

  const formatCurrency = (value) => {
    return value.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
  };

  const formatShutterSpeed = (value) => {
    const tolerance = 1e-6; // Toleransi untuk pembulatan kecil
    if (value < 1 && value > 0) {
      const n = Math.round(1 / value);
      if (Math.abs(1 / n - value) < tolerance) {
        return `1/${n}`; // Menampilkan dalam bentuk "1/n"
      }
    }
    return value;
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCameras(cameras.map((camera) => camera.id)); // Pilih semua kamera
      console.log(
        "All Camera IDs Selected:",
        cameras.map((camera) => camera.id)
      );
    } else {
      setSelectedCameras([]); // Hapus semua pilihan
      console.log("No Camera Selected");
    }
  };

  const handleSelectCamera = (id) => {
    setSelectedCameras(
      (prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((cameraId) => cameraId !== id) // Hapus jika sudah dipilih
          : [...prevSelected, id] // Tambahkan jika belum dipilih
    );
    console.log("Selected Camera IDs:", selectedCameras);
  };

  const handleNextPage = () => {
    navigate("/comparison");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Choose Camera</h1>

      {/* Wrapper Tabel dengan Overflow Horizontal */}
      <div className="max-w-full">
        <div className="overflow-x-auto overflow-y-auto max-h-[500px] border border-gray-300 rounded-lg">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 text-xs bg-gray-200 sticky top-0 p-1">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedCameras.length === cameras.length && cameras.length > 0}
                  />
                </th>
                {columns.map((col) => (
                  <th key={col.key} className={`border border-gray-300 text-xs bg-gray-200 sticky top-0 p-1`}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cameras.map((camera, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2 text-xs text-center">
                    <input
                      type="checkbox"
                      checked={selectedCameras.includes(camera.id)}
                      onChange={() => handleSelectCamera(camera.id)}
                    />
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="border border-gray-300 p-2 text-xs text-center">
                      {col.key === "price"
                        ? formatCurrency(camera[col.key])
                        : col.key === "min_shutter_speed" || col.key === "max_shutter_speed"
                        ? formatShutterSpeed(camera[col.key])
                        : camera[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <button
          className={`px-4 py-2 text-white rounded ${
            selectedCameras.length > 1 ? "bg-blue-500" : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={selectedCameras.length < 2}
          onClick={handleNextPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ChooseCameraPage;
