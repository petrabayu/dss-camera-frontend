import React, { useState, useEffect } from "react";

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

const initialCameraData = {
  camera_name: "",
  price: "",
  pixel: "",
  max_resolution_width: "",
  max_resolution_length: "",
  sensor_size: "",
  min_iso: "",
  max_iso: "",
  min_shutter_speed: "",
  max_shutter_speed: "",
  continues_drive: "",
  max_video_resolution_width: "",
  max_video_resolution_length: "",
  max_video_fps: "",
  battery_life: "",
  articulated_lcd: "",
  screen_dots: "",
  weight: "",
};

const formFields = [
  { name: "camera_name", label: "Camera Name", type: "text", placeholder: "Contoh: Canon EOS R5" },
  { name: "price", label: "Price (IDR)", type: "number", placeholder: "Contoh: 25000000" },
  { name: "pixel", label: "Pixels (MP)", type: "number", placeholder: "Contoh: 24" },
  { name: "max_resolution_width", label: "Max Resolution Width (px)", type: "number", placeholder: "Contoh: 6000" },
  { name: "max_resolution_length", label: "Max Resolution Length (px)", type: "number", placeholder: "Contoh: 4000" },
  {
    name: "sensor_size",
    label: "Sensor Size",
    type: "select",
    options: ['1/2.3"', '1/1.7"', '2/3"', '1"', "Four Thirds", "APS-C", "APS-H", "Full Frame", "Medium Format"],
  },
  { name: "min_iso", label: "ISO Min", type: "number", placeholder: "Contoh: 100" },
  { name: "max_iso", label: "ISO Max", type: "number", placeholder: "Contoh: 51200" },
  { name: "min_shutter_speed", label: "Shutter Speed Min", type: "text", placeholder: "Contoh: 30" },
  { name: "max_shutter_speed", label: "Shutter Speed Max", type: "text", placeholder: "Contoh: 1/8000" },
  { name: "continues_drive", label: "Continuous Drive (fps)", type: "number", placeholder: "Contoh: 20" },
  {
    name: "max_video_resolution_width",
    label: "Video Resolution Width (px)",
    type: "number",
    placeholder: "Contoh: 3840",
  },
  {
    name: "max_video_resolution_length",
    label: "Video Resolution Length (px)",
    type: "number",
    placeholder: "Contoh: 2160",
  },
  { name: "max_video_fps", label: "Video FPS Max", type: "number", placeholder: "Contoh: 120" },
  { name: "battery_life", label: "Battery Life (shots)", type: "number", placeholder: "Contoh: 350" },
  {
    name: "articulated_lcd",
    label: "Articulated LCD",
    type: "select",
    options: ["Fixed", "Tilting", "Fully Articulated"],
  },
  { name: "screen_dots", label: "Screen Dots (px)", type: "number", placeholder: "Contoh: 1040000" },
  { name: "weight", label: "Weight (g)", type: "number", placeholder: "Contoh: 300" },
];

const CameraForm = ({ onSave, onCancel, initialData }) => {
  const [cameraData, setCameraData] = useState(initialData || initialCameraData);

  useEffect(() => {
    if (initialData) {
      setCameraData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setCameraData({ ...cameraData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Fungsi untuk mengonversi "1/n" ke desimal hanya pada saat submit
    const convertShutterSpeed = (value) => {
      if (typeof value === "string" && value.includes("/")) {
        const parts = value.split("/");
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          return parseFloat(parts[0]) / parseFloat(parts[1]);
        }
      }
      return parseFloat(value); // Jika bukan dalam format "1/n", konversi langsung ke number
    };

    // Buat salinan `cameraData` dengan nilai shutter speed yang dikonversi
    const dataToSave = {
      ...convertToCorrectTypes(cameraData), // Konversi tipe data untuk field lain
      min_shutter_speed: convertShutterSpeed(cameraData.min_shutter_speed),
      max_shutter_speed: convertShutterSpeed(cameraData.max_shutter_speed),
    };

    onSave(dataToSave); // Kirim data saat submit
  };

  const handleShutterSpeedChange = (e) => {
    const { name, value } = e.target;
    setCameraData({ ...cameraData, [name]: value }); // Simpan sebagai string
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-2 rounded-lg bg-gray-100">
      {formFields.map((field) => (
        <div key={field.name} className="mb-4">
          <label className="font-semibold">{field.label}:</label>
          {field.type === "select" ? (
            <select
              name={field.name}
              value={cameraData[field.name]}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">Select {field.label}</option>
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              name={field.name}
              value={cameraData[field.name]}
              placeholder={field.placeholder}
              onChange={
                field.name === "min_shutter_speed" || field.name === "max_shutter_speed"
                  ? handleShutterSpeedChange // Khusus untuk shutter speed
                  : handleChange
              }
              className="border p-2 rounded w-full"
              required
            />
          )}
        </div>
      ))}
      <div className="mt-4 flex space-x-2">
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
          Save
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CameraForm;
