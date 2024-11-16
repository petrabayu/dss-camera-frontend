import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const RankingPage = () => {
  const [rankingData, setRankingData] = useState([]);
  const [loading, setLoading] = useState(false);

  // const handleShowResults = async () => {
  //   try {
  //     setLoading(true);

  //     const response = await axiosInstance.get("/topsis-scores/ranking");
  //     const rankingResults = response.data;

  //     console.log("Ranking Results with Camera Names:", rankingResults);

  //     setRankingData(
  //       rankingResults.map((item, index) => ({
  //         rank: index + 1,
  //         camera_name: item.camera_name,
  //         score: item.score,
  //       }))
  //     );

  //     // Kosongkan local storage
  //     localStorage.removeItem("selectedCameras");
  //   } catch (error) {
  //     console.error("Error fetching ranking results:", error);
  //     alert("Gagal mengambil hasil ranking.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleShowResults = async () => {
    try {
      setLoading(true);

      // Ambil kamera_id dari local storage
      const selectedCameras = JSON.parse(localStorage.getItem("selectedCameras"));
      console.log("Selected Camera IDs from Local Storage:", selectedCameras);

      if (!selectedCameras || selectedCameras.length === 0) {
        alert("Tidak ada kamera yang dipilih.");
        setLoading(false);
        return;
      }

      // Ambil bobot terbaru dari backend
      const ahpWeightResponse = await axiosInstance.get("/ahp-weights/latest");
      console.log("Latest AHP Weights from Backend:", ahpWeightResponse.data.data);

      const ahpWeights = ahpWeightResponse.data.data;

      if (!ahpWeights) {
        alert("Gagal mengambil bobot AHP terbaru.");
        setLoading(false);
        return;
      }

      console.log("Data yang dikirim ke backend untuk TOPSIS:", {
        alternativeId: selectedCameras,
        ahpWeightId: ahpWeights, // Pastikan ahpWeights adalah ID saja
      });

      // Kirim data ke backend untuk proses TOPSIS
      const topsisResponse = await axiosInstance.post("/topsis-calculation", {
        alternativeId: selectedCameras,
        ahpWeightId: ahpWeights,
      });

      const topsisResults = topsisResponse.data;
      console.log("TOPSIS Calculation Results from Backend:", topsisResults);

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
      console.log("Ranking with names:", rankingWithNames);

      // Terima hasil rangking dari backend
      setRankingData(rankingWithNames);

      // Kosongkan local storage
      localStorage.removeItem("selectedCameras");
    } catch (error) {
      console.error("Error fetching TOPSIS results:", error);
      alert("Gagal mengambil hasil ranking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Ranking Page</h1>
      <button
        onClick={handleShowResults}
        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Processing..." : "Show Results"}
      </button>
      <div className="mt-6">
        {rankingData.length > 0 ? (
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Rank</th>
                <th className="border border-gray-300 px-4 py-2">Camera Name</th>
                <th className="border border-gray-300 px-4 py-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {rankingData.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.camera_name}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">Belum ada hasil rangking yang ditampilkan.</p>
        )}
      </div>
    </div>
  );
};

export default RankingPage;
