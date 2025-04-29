import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { FiAlertTriangle } from "react-icons/fi";

import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const RankingPage = () => {
  const [rankingData, setRankingData] = useState([]);
  const [ahpWeights, setAhpWeights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [mainCriteriaWeights, setMainCriteriaWeights] = useState([]);

  const mainCriteriaLabels = [
    "Harga",
    "Kualitas Gambar",
    "Performa",
    "Kualitas Video",
    "Kemudahan Penggunaan",
  ];

  useEffect(() => {
    const weights = JSON.parse(localStorage.getItem("mainCriteriWeight"));
    if (weights) setMainCriteriaWeights(weights);
  }, []);

  const translatedLabels = {
    price_weight: "Harga",
    pixel_weight: "Pixel",
    max_resolution_weight: "Resolusi Maksimal",
    sensor_size_weight: "Ukuran Sensor",
    min_iso_weight: "ISO (min)",
    max_iso_weight: "ISO (maks)",
    min_shutter_speed_weight: "Shutter Speed (min)",
    max_shutter_speed_weight: "Shutter Speed (maks)",
    continues_drive_weight: "Continues Drive",
    max_video_resolution_weight: "Video Resolusi (maks)",
    max_video_fps_weight: "Video FPS",
    battery_life_weight: "Battery Life",
    articulated_lcd_weight: "Articulated LCD",
    screen_dots_weight: "Screen Dots",
    weight_weight: "Berat",
  };

  // Data Bar Chart
  const barChartData = {
    labels: rankingData.map((item) => item.camera_name), // Nama kamera
    datasets: [
      {
        label: "Skor Kedekatan",
        data: rankingData.map((item) => item.score), // Skor kedekatan
        backgroundColor: "rgba(54, 162, 235, 0.5)", // Warna batang
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    indexAxis: "y", // Horizontal bar chart
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          precision: 2, // Untuk memastikan skor ditampilkan dengan dua desimal
        },
      },
    },
  };

  const barChartWeight = {
    labels: ahpWeights ? Object.keys(ahpWeights).map((key) => translatedLabels[key] || key) : [],
    datasets: [
      {
        label: "Bobot Kriteria",
        data: ahpWeights ? Object.values(ahpWeights) : [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barChartWeightOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 2,
        },
      },
      x: {
        ticks: {
          autoSkip: false,
        },
      },
    },
  };

  const pieChartDataMainCriteria = {
    labels: mainCriteriaLabels, // Nama kriteria
    datasets: [
      {
        data: mainCriteriaWeights, // Bobot kriteria
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)", // Warna untuk setiap kategori
          "rgba(54, 162, 235, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptionsMainCriteria = {
    responsive: true,
    plugins: {
      legend: { position: "right" },
      tooltip: { enabled: true },
    },
  };

  const addGapScores = (data) => {
    return data.map((item, index) => {
      const gap = index === 0 ? "-" : (data[index - 1].score - item.score).toFixed(4);
      return {
        ...item,
        gap_score: gap,
      };
    });
  };

  const handleShowResults = async () => {
    try {
      setLoading(true);

      // Ambil kamera_id dari local storage
      const selectedCameras = JSON.parse(localStorage.getItem("selectedCameras"));
      if (!selectedCameras || selectedCameras.length === 0) {
        setAlertVisible(true); // Tampilkan alert
        setLoading(false);
        return;
      }

      // Ambil bobot terbaru dari backend
      const ahpWeightResponse = await axiosInstance.get("/ahp-weights/latest");
      const ahpWeights = ahpWeightResponse.data.data;

      if (!ahpWeights) {
        alert("Gagal mengambil bobot AHP terbaru.");
        setLoading(false);
        return;
      }

      // Kirim data ke backend untuk proses TOPSIS
      const topsisResponse = await axiosInstance.post("/topsis-calculation", {
        alternativeId: selectedCameras,
        ahpWeightId: ahpWeights,
      });

      const topsisResults = topsisResponse.data;
      if (!topsisResults || !topsisResults.cameraId || !topsisResults.idealSolution) {
        alert("Gagal memproses hasil TOPSIS.");
        setLoading(false);
        return;
      }

      const rankingWithoutNames = topsisResults.cameraId
        .map((id, index) => ({
          camera_id: id,
          score: topsisResults.idealSolution[index],
        }))
        .sort((a, b) => b.score - a.score);

      const cameraNamesPromises = rankingWithoutNames.map((item) =>
        axiosInstance.get(`/cameras/${item.camera_id}`).then((res) => ({
          ...item,
          camera_name: res.data.data[0]?.camera_name || "Unknown", // Asumsikan respons mengandung `data.camera_name`
        }))
      );

      const rankingWithNames = await Promise.all(cameraNamesPromises);

      // Tambahkan Gap Score
      const finalRanking = addGapScores(rankingWithNames);
      setRankingData(finalRanking);

      // Ambil bobot AHP berdasarkan ID terbaru
      const weightResponse = await axiosInstance.get(`/ahp-weights/${ahpWeights}`);
      setAhpWeights(weightResponse.data.data);
    } catch (error) {
      console.error("Error fetching TOPSIS results:", error);
      alert("Gagal mengambil hasil ranking.");
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationMessage = () => {
    if (!rankingData.length || !mainCriteriaWeights.length) return "";

    const recommendedCamera = rankingData[0]?.camera_name || "tidak tersedia";
    const highestWeightIndex = mainCriteriaWeights.indexOf(Math.max(...mainCriteriaWeights));
    const strongestCriteria = mainCriteriaLabels[highestWeightIndex];

    return (
      <>
        Sistem menyarankan kamera <strong>{recommendedCamera}</strong> sebagai kamera pilihan Anda
        karena kamera <strong>{recommendedCamera}</strong> memiliki keunggulan dalam{" "}
        <strong>{strongestCriteria}</strong> dibandingkan dengan kamera lain dan sesuai dengan
        preferensi Anda.
      </>
    );
  };

  return (
    <div>
      <div className="my-4">
        <h1 className="text-2xl font-bold mb-2">Peringkat</h1>
        <p className="text-gray-600 text-base w-2/3">
          Halaman ini menampilkan peringkat kamera berdasarkan hasil perhitungan. Anda dapat melihat
          kamera mana yang paling sesuai dengan preferensi dan kebutuhan Anda.
        </p>
      </div>
      <button
        onClick={handleShowResults}
        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Processing..." : "Show Results"}
      </button>
      <div className="mt-6">
        {rankingData.length > 0 ? (
          <>
            <div className="my-6 bg-blue-200 p-4 rounded shadow w-2/4">
              <h3 className="text-xl font-semibold">Hasil Rekomendasi</h3>
              <p className="text-gray-700">{getRecommendationMessage()}</p>
            </div>
            <table className="min-w-full text-center border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 ">
                  <th className="border border-gray-300 px-4 py-2">Rank</th>
                  <th className="border border-gray-300 px-4 py-2">Camera Name</th>
                  <th className="border border-gray-300 px-4 py-2">Score</th>
                  <th className="border border-gray-300 px-4 py-2">Gap Score</th>
                </tr>
              </thead>
              <tbody>
                {rankingData.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.camera_name}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.score.toFixed(4)}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.gap_score}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Bar Chart */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Visualisasi Skor Kedekatan</h2>
              <Bar data={barChartData} options={barChartOptions} />
            </div>

            <div className="flex flex-wrap gap-6 mt-6">
              {/* Tabel Bobot */}
              <div className="w-1/3 bg-white rounded shadow p-4">
                <h2 className="text-xl font-semibold mb-4">Bobot Kriteria (AHP)</h2>
                <table className="w-full text-center border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 px-4 py-2">Kriteria</th>
                      <th className="border border-gray-300 px-4 py-2">Bobot</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ahpWeights &&
                      Object.entries(ahpWeights).map(([key, value], index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 px-4 py-2">
                            {translatedLabels[key] || key}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">{value.toFixed(4)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Area Kanan */}
              <div className="flex flex-col flex-1 gap-6">
                {/* Bar Chart */}
                <div className="flex-1 bg-white rounded shadow p-4">
                  <h2 className="text-xl font-semibold mb-4">Distribusi Bobot Kriteria</h2>
                  {ahpWeights && <Bar data={barChartWeight} options={barChartWeightOptions} />}
                </div>

                {/* Tabel Kriteria Utama dan Pie Chart */}
                <div className="flex gap-6">
                  {/* Tabel Kriteria Utama */}
                  <div className="flex-1 bg-white rounded shadow p-4">
                    <h2 className="text-xl font-semibold mb-4">Bobot Kriteria Utama</h2>
                    <table className="w-full text-center border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="border border-gray-300 px-4 py-2">Kriteria</th>
                          <th className="border border-gray-300 px-4 py-2">Bobot</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mainCriteriaWeights.map((weight, index) => (
                          <tr key={index}>
                            <td className="border border-gray-300 px-4 py-2">
                              {mainCriteriaLabels[index]}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {weight.toFixed(4)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pie Chart */}
                  <div className="flex-1 bg-white rounded shadow p-4">
                    <h2 className="text-xl font-semibold mb-4">Distribusi Bobot Kriteria Utama</h2>
                    {mainCriteriaWeights.length > 0 ? (
                      <Pie data={pieChartDataMainCriteria} options={pieChartOptionsMainCriteria} />
                    ) : (
                      <p className="text-gray-600">Bobot kriteria utama belum tersedia.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-600">
            Tekan button <strong>Show Results</strong> untuk menampilkan daftar peringkat.
          </p>
        )}
      </div>

      {alertVisible && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <div className="flex items-center space-x-2">
              <FiAlertTriangle size={24} />
              <h2 className="text-2xl font-semibold text-gray-800">Peringatan</h2>
            </div>
            <p className="text-gray-600 mt-2">
              Tidak ada kamera yang dipilih. Silakan pilih kamera dan lakukan perbandingan
              berpasangan untuk mendapatkan hasil.
            </p>
            <div className="mt-4 text-right">
              <button
                onClick={() => setAlertVisible(false)} // Tutup alert
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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

export default RankingPage;
