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
  { name: "camera_name", label: "Camera Name", type: "text" },
  { name: "price", label: "Price", type: "number" },
  { name: "pixel", label: "Pixels", type: "number" },
  { name: "max_resolution_width", label: "Max Res (W)", type: "number" },
  { name: "max_resolution_length", label: "Max Res (L)", type: "number" },
  {
    name: "sensor_size",
    label: "Sensor Size",
    type: "select",
    options: ['1/2.3"', '1/1.7"', '2/3"', '1"', "Four Thirds", "APS-C", "APS-H", "Full Frame", "Medium Format"],
  },
  { name: "min_iso", label: "ISO Min", type: "number" },
  { name: "max_iso", label: "ISO Max", type: "number" },
  { name: "min_shutter_speed", label: "Shutter Min", type: "text" },
  { name: "max_shutter_speed", label: "Shutter Max", type: "text" },
  { name: "continues_drive", label: "Cont. Drive", type: "number" },
  { name: "max_video_resolution_width", label: "Video Res (W)", type: "number" },
  { name: "max_video_resolution_length", label: "Video Res (L)", type: "number" },
  { name: "max_video_fps", label: "Video FPS Max", type: "number" },
  { name: "battery_life", label: "Battery Life", type: "number" },
  {
    name: "articulated_lcd",
    label: "Articulated LCD",
    type: "select",
    options: ["Fixed", "Tilting", "Fully Articulated"],
  },
  { name: "screen_dots", label: "Screen Dots", type: "number" },
  { name: "weight", label: "Weight", type: "number" },
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

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if (Object.keys(cameraData).length > 0) {
  //     const dataToSave = convertToCorrectTypes(cameraData);
  //     onSave(dataToSave); // Kirim data saat submit
  //     // setCameraData(initialCameraData); // Reset setelah save
  //   } else {
  //     console.error("No data to save");
  //   }
  // };

  // Fungsi untuk memproses input shutter speed dengan format 1/n atau angka biasa

  // const handleShutterSpeedChange = (e) => {
  //   const { name, value } = e.target;
  //   if (value.includes("/")) {
  //     const parts = value.split("/");
  //     if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
  //       const decimalValue = parseFloat(parts[0]) / parseFloat(parts[1]);
  //       setCameraData({ ...cameraData, [name]: decimalValue });
  //     } else {
  //       setCameraData({ ...cameraData, [name]: value });
  //     }
  //   } else {
  //     setCameraData({ ...cameraData, [name]: parseFloat(value) || "" });
  //   }
  // };

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
              // onChange={
              //   field.name === "min_shutter_speed" || field.name === "max_shutter_speed"
              //     ? handleShutterSpeedChange
              //     : handleChange
              // }
              className="border p-2 rounded w-full"
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
              onChange={
                field.name === "min_shutter_speed" || field.name === "max_shutter_speed"
                  ? handleShutterSpeedChange // Khusus untuk shutter speed
                  : handleChange
              }
              // onChange={handleChange}
              className="border p-2 rounded w-full"
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
