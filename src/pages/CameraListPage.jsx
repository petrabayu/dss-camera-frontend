import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import CameraForm from "../components/CameraForm";
import ConfirmModal from "../components/ConfirmModal";
import { FiSearch, FiEdit, FiTrash2, FiAlertCircle } from "react-icons/fi";

const CameraListPage = () => {
  const [cameras, setCameras] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCamera, setEditingCamera] = useState(null);

  // success error message
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [searchQuery, setSearchQuery] = useState(""); // fitur search

  // confirm modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cameraToDelete, setCameraToDelete] = useState(null);

  // Pagination state
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCameras = async () => {
    try {
      const response = await axiosInstance.get("/cameras");
      setCameras(response.data.data);
      // console.log("repsonse dua", response.data.data);
    } catch (error) {
      console.error("Error fetching cameras:", error);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  const convertToCorrectTypes = (data) => {
    const convertedData = {
      ...data,
      price: Number(data.price),
      pixel: Number(data.pixel),
      continues_drive: Number(data.continues_drive),
      max_resolution_width: Number(data.max_resolution_width),
      max_resolution_length: Number(data.max_resolution_length),
      min_iso: Number(data.min_iso),
      max_iso: Number(data.max_iso),
      min_shutter_speed: parseFloat(data.min_shutter_speed),
      max_shutter_speed: parseFloat(data.max_shutter_speed),
      max_video_resolution_width: Number(data.max_video_resolution_width),
      max_video_resolution_length: Number(data.max_video_resolution_length),
      max_video_fps: Number(data.max_video_fps),
      battery_life: Number(data.battery_life),
      screen_dots: Number(data.screen_dots),
      weight: Number(data.weight),
    };
    console.log("Converted data:", convertedData); // Tambahkan log ini
    return convertedData;
  };

  // Kolom tabel yang akan ditampilkan
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
    return value; // Jika tidak dalam bentuk 1/n, tampilkan seperti semula
  };

  const formatDecimal = (value, decimals = 1) => {
    return parseFloat(value).toFixed(decimals);
  };

  // fitur search
  const filteredCameras = cameras.filter(
    (camera) => camera.camera_name.toLowerCase().includes(searchQuery.toLowerCase()) // Filter berdasarkan nama kamera
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCameras.length / perPage);
  const currentCameras = filteredCameras.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleEdit = (camera) => {
    setEditingCamera(camera);
    setShowForm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(`/cameras/${cameraToDelete.id}`);
      setCameras((prevCameras) => prevCameras.filter((c) => c.id !== cameraToDelete.id));
      console.log("Camera Deleted:", cameraToDelete.camera_name);
      setShowConfirmModal(false);
      setCameraToDelete(null);
    } catch (error) {
      console.error("Error deleting camera:", error);
    }
  };

  const handleDelete = (camera) => {
    setCameraToDelete(camera);
    setShowConfirmModal(true);
  };

  const handleSave = async (cameraData) => {
    try {
      console.log("Original data before conversion:", cameraData);
      const updatedCameraData = convertToCorrectTypes(cameraData);
      console.log("Data after conversion:", updatedCameraData);

      if (editingCamera) {
        try {
          await axiosInstance.put(`/cameras/${editingCamera.id}`, updatedCameraData, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          setCameras((prevCameras) => prevCameras.map((c) => (c.id === editingCamera.id ? updatedCameraData : c)));
          console.log("Updated:", updatedCameraData.camera_name);
          setSuccessMessage("Data kamera telah berhasil diperbarui!");
          setShowForm(false);
          setEditingCamera(null);

          setTimeout(() => setSuccessMessage(""), 3000);
        } catch (putError) {
          console.error("Error saat mengupdate kamera:", putError);

          // Tampilkan pesan error dari backend jika ada
          if (putError.response && putError.response.data) {
            setErrorMessage(
              putError.response.data.message || "Data yang diinput tidak sesuai format. Silakan periksa kembali."
            );
          } else {
            setErrorMessage("Terjadi kesalahan jaringan atau server. Silakan coba lagi.");
          }

          // Pastikan form tetap terbuka jika terjadi kesalahan
          setShowForm(true);
        }
      } else {
        const cameraDataWithUser = { ...updatedCameraData, user_id: 12 };

        try {
          await axiosInstance.post("/cameras", cameraDataWithUser);
          fetchCameras();

          setSuccessMessage("Data kamera telah berhasil disimpan!");

          setShowForm(false);
          setEditingCamera(null);

          setTimeout(() => setSuccessMessage(""), 3000); // Hapus pesan setelah 3 detik
        } catch (postError) {
          console.error("Error saat menyimpan kamera:", postError);

          // Tangkap pesan error dari backend jika ada
          if (postError.response && postError.response.data) {
            setErrorMessage(postError.response.data.message || "Gagal menyimpan kamera. Silakan periksa data Anda.");
          } else {
            setErrorMessage("Terjadi kesalahan jaringan atau server. Silakan coba lagi.");
          }
          setShowForm(true);
        }
      }
    } catch (error) {
      console.error("Error saving camera:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update nilai pencarian
    setCurrentPage(1); // Reset ke halaman pertama saat melakukan pencarian
  };

  return (
    <div>
      <div className="my-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Daftar Kamera</h1>
        <p className="text-gray-600 text-base w-2/3">
          Halaman ini menampilkan daftar semua kamera yang tersedia dalam database. Anda dapat menambahkan kamera baru,
          mengedit informasi kamera yang ada, atau menghapus data yang tidak diperlukan.
        </p>
      </div>

      {/* Input Pencarian */}
      <div className="mb-4 flex justify-between items-center">
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search by camera name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded px-2 py-1 w-full pl-10"
          />
          <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400">
            <FiSearch />
          </span>
        </div>
        <div>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-blue-500 text-white rounded">
            Add Camera
          </button>
        </div>
      </div>

      {/* Wrapper Tabel dengan Overflow Horizontal */}
      <div className={`max-w-full ${showForm ? "blur-sm" : ""}`}>
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
                  <td className="border m-auto items-center justify-center p-4 flex space-x-2">
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

      {/* Dropdown untuk jumlah kamera per halaman */}
      <div className="mt-4 flex justify-between items-center">
        <div className=" px-8"></div>
        <div>
          {/* Pagination Controls */}
          <div className="space-x-2 text-sm">
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
        <div>
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
            <option value={filteredCameras.length}>All</option>
          </select>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 ">
          <div className="bg-white p-4 rounded-xl w-2/3 max-h-[90vh] overflow-y-auto">
            <CameraForm
              initialData={editingCamera}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditingCamera(null);
              }}
            />
            {errorMessage && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded mt-4">
                <FiAlertCircle className="inline text-red-500 mr-1" /> {errorMessage}
              </div>
            )}
          </div>
        </div>
      )}

      {showConfirmModal && (
        <ConfirmModal
          title="Confirm Deletion"
          message={`Are you sure you want to delete camere ${cameraToDelete?.camera_name}?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowConfirmModal(false);
            setCameraToDelete(null);
          }}
        />
      )}

      {successMessage && (
        <div className="fixed top-12 left-1/2 transform -translate-x-1/2 bg-green-200 text-green-700 px-4 py-2 rounded shadow-lg z-50">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default CameraListPage;
