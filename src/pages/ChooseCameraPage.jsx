import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiHelpCircle } from "react-icons/fi";

const ChooseCameraPage = () => {
  const [cameras, setCameras] = useState([]);
  const [selectedCameras, setSelectedCameras] = useState(JSON.parse(localStorage.getItem("selectedCameras")) || []);
  const navigate = useNavigate();

  // fitur search
  const [filteredCameras, setFilteredCameras] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const fetchCameras = async () => {
    try {
      const response = await axiosInstance.get("/cameras");
      setCameras(response.data.data);
      setFilteredCameras(response.data.data); // fitur search
    } catch (error) {
      console.error("Error fetching cameras:", error);
    }
  };

  useEffect(() => {
    fetchCameras();
    // console.log("Current Selected Camera IDs:", selectedCameras);
  }, [selectedCameras]);

  useEffect(() => {
    localStorage.setItem("selectedCameras", JSON.stringify(selectedCameras));
  }, [selectedCameras]);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  // fitur search
  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchKeyword(keyword);
    setFilteredCameras(
      cameras.filter(
        (camera) => camera.camera_name.toLowerCase().includes(keyword) // Filter berdasarkan nama kamera
      )
    );
  };

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
      // console.log(
      //   "All Camera IDs Selected:",
      //   cameras.map((camera) => camera.id)
      // );
    } else {
      setSelectedCameras([]); // Hapus semua pilihan
      // console.log("No Camera Selected");
    }
  };

  const handleSelectCamera = (id) => {
    setSelectedCameras(
      (prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((cameraId) => cameraId !== id) // Hapus jika sudah dipilih
          : [...prevSelected, id] // Tambahkan jika belum dipilih
    );
    // console.log("Selected Camera IDs:", selectedCameras);
  };

  const handleNextPage = () => {
    navigate("/comparison");
  };

  const formatDecimal = (value, decimals = 1) => {
    return parseFloat(value).toFixed(decimals);
  };

  return (
    <div>
      <div className="my-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-gray-800">Pilih Kamera</h1>
          <button onClick={handleModalToggle} className="text-blue-600 hover:text-blue-800  border-blue-600">
            <FiHelpCircle size={18} />
          </button>
        </div>
        <p className="text-gray-600 text-base mt-2 w-2/3">
          Pilih kamera alternatif yang ingin Anda bandingkan dan evaluasi. Kamera yang dipilih akan digunakan dalam
          proses perhitungan untuk menentukan peringkat kamera terbaik.
        </p>
      </div>

      {/* Input untuk pencarian */}
      <div className="mb-4 flex justify-between items-center">
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search by camera name..."
            value={searchKeyword}
            onChange={handleSearch}
            className="border border-gray-300 rounded px-2 py-1 w-full pl-10"
          />
          <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400">
            <FiSearch />
          </span>
        </div>
      </div>

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
                    // checked={selectedCameras.length === cameras.length && cameras.length > 0} // real one
                    checked={selectedCameras.length === filteredCameras.length && filteredCameras.length > 0}
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
              {filteredCameras.map((camera, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2 text-xs text-center">
                    <input
                      type="checkbox"
                      checked={selectedCameras.includes(camera.id)}
                      onChange={() => handleSelectCamera(camera.id)}
                    />
                  </td>
                  {/* real one
              {cameras.map((camera, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2 text-xs text-center">
                    <input
                      type="checkbox"
                      checked={selectedCameras.includes(camera.id)}
                      onChange={() => handleSelectCamera(camera.id)}
                    />
                  </td> */}
                  {columns.map((col) => (
                    <td key={col.key} className="border border-gray-300 p-2 text-xs text-center">
                      {col.key === "price"
                        ? formatCurrency(camera[col.key])
                        : col.key === "continues_drive"
                        ? formatDecimal(camera[col.key])
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
          className={`px-4 py-2 text-white rounded w-24 ${
            selectedCameras.length > 1 ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={selectedCameras.length < 2}
          onClick={handleNextPage}
        >
          Next
        </button>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold text-gray-800">Kamera Tidak Ditemukan</h2>
            <p className="text-gray-600 mt-2">
              Jika kamera yang Anda cari tidak ada, silakan tambahkan kamera baru di halaman{" "}
              <strong>Daftar Kamera</strong>. Anda dapat melakukannya dengan menekan tombol{" "}
              <strong>"Add Camera"</strong> di halaman tersebut.
            </p>
            <div className="mt-4 text-right">
              <button
                onClick={handleModalToggle}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChooseCameraPage;
