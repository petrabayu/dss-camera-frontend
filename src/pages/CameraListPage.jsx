import React, { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import cameraData from "../data/camera_data.json";

const CameraListPage = () => {
  // Data kamera contoh (sesuai file yang diberikan)
  const [cameras, setCameras] = useState(cameraData);

  // Kolom tabel yang akan ditampilkan
  const columns = [
    { key: "camera_name", label: "Camera Name" },
    { key: "price", label: "Price" },
    { key: "pixels", label: "Pixels" },
    { key: "max_resolution_w", label: "Max Res (W)" },
    { key: "max_resolution_l", label: "Max Res (L)" },
    { key: "sensor_size", label: "Sensor Size" },
    { key: "iso_min", label: "ISO Min" },
    { key: "iso_max", label: "ISO Max" },
    { key: "shutter_speed_min", label: "Shutter Min" },
    { key: "shutter_speed_max", label: "Shutter Max" },
    { key: "continues_drive", label: "Cont. Drive" },
    { key: "video_resolution_max_w", label: "Video Res (W)" },
    { key: "video_resolution_max_l", label: "Video Res (L)" },
    { key: "video_fps_max", label: "Video FPS Max" },
    { key: "battery_life", label: "Battery Life" },
    { key: "articulated_lcd", label: "Articulated LCD" },
    { key: "screen_dots", label: "Screen Dots" },
    { key: "weight", label: "Weight" },
  ];

  const formatCurrency = (value) => {
    return value.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
  };

  // Pagination state
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(cameras.length / perPage);
  const currentCameras = cameras.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleEdit = (camera) => {
    console.log("Edit", camera);
  };

  const handleDelete = (camera) => {
    console.log("Delete", camera);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Camera List</h1>

      {/* Dropdown untuk jumlah kamera per halaman */}
      <div className="mb-4">
        <label htmlFor="perPage" className="mr-2">
          Show:
        </label>
        <select
          id="perPage"
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={cameras.length}>All</option>
        </select>
      </div>

      {/* Wrapper Tabel dengan Overflow Horizontal */}
      <div className="max-w-full">
        <div className="overflow-x-auto overflow-y-auto max-h-[500px] border border-gray-300 rounded-lg">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className={`border border-gray-300 text-xs bg-gray-200 sticky top-0 p-1`}>
                    {col.label}
                  </th>
                ))}
                <th className={`border border-gray-300 text-xs bg-gray-200 sticky top-0 p-1`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCameras.map((camera, index) => (
                <tr key={index}>
                  {columns.map((col) => (
                    <td key={col.key} className={`border border-gray-300 p-2 text-xs text-center `}>
                      {col.key === "price" ? formatCurrency(camera[col.key]) : camera[col.key]}
                    </td>
                  ))}
                  <td className="border m-auto p-4 flex space-x-2">
                    <button onClick={() => handleEdit(camera)} className="text-blue-500">
                      <FiEdit />
                    </button>
                    <button onClick={() => handleDelete(camera)} className="text-red-500">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center space-x-4 items-center mt-4 text-sm">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CameraListPage;
