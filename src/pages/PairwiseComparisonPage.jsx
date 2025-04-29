import React, { useState } from "react";
import PairwiseSlider from "../components/PairwiseSlider";
import AHPServices from "../services/AHPServices";
import axiosInstance from "../utils/axiosInstance";
import { FiHelpCircle, FiAlertCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const PairwiseComparisonPage = () => {
  const [isCalculated, setIsCalculated] = useState(false);
  const [consistencyStatus, setConsistencyStatus] = useState({});
  const [pairwiseValues, setPairwiseValues] = useState({
    mainCriteria: [
      // Matriks perbandingan berpasangan untuk kriteria utama
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
    ],
    price: [
      // Matriks perbandingan berpasangan untuk subkriteria harga
      [1],
    ],
    imageQuality: [
      // Matriks perbandingan berpasangan untuk subkriteria kualitas gambar
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    performance: [
      // Matriks perbandingan berpasangan untuk subkriteria performa
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
    ],
    videoQuality: [
      // Matriks perbandingan berpasangan untuk subkriteria kualitas video
      [1, 1],
      [1, 1],
    ],
    easeOfUse: [
      // Matriks perbandingan berpasangan untuk subkriteria kemudahan penggunaan
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
    ],
  });
  const [isAllConsistent, setIsAllConsistent] = useState(false);
  const [finalWeights, setFinalWeights] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Buat salinan dari pairwiseValues dengan konversi nilai negatif menjadi kebalikan
  const getTransformedPairwiseValues = () => {
    const transformedValues = {};

    for (const [criteriaKey, matrix] of Object.entries(pairwiseValues)) {
      transformedValues[criteriaKey] = matrix.map((row) =>
        row.map((value) => (value < 0 ? 1 / Math.abs(value) : value))
      );
    }

    return transformedValues;
  };

  const completePairwiseMatrix = (matrix) => {
    const size = matrix.length;
    const pairwiseMatrix = matrix.map((row) => [...row]);

    for (let i = 0; i < size; i++) {
      for (let j = i + 1; j < size; j++) {
        // Isi nilai kebalikannya di posisi [j][i]
        pairwiseMatrix[j][i] = 1 / pairwiseMatrix[i][j];
      }
    }

    return pairwiseMatrix;
  };

  const getSymmetricPairwiseValues = () => {
    const transformedValues = getTransformedPairwiseValues();
    const symmetricValues = {};

    for (const [criteriaKey, matrix] of Object.entries(transformedValues)) {
      symmetricValues[criteriaKey] = completePairwiseMatrix(matrix);
    }
    console.log("Matriks Perbandingan Berpasangan:", symmetricValues); // matriks perbandingan berpasangan
    return symmetricValues;
  };

  // Struktur data untuk setiap kelompok kriteria dan pasangan perbandingan
  const comparisonData = {
    mainCriteria: {
      title: "Perbandingan Kriteria Utama",
      pairs: [
        { pair: ["Kualitas Gambar", "Harga"], rowIndex: 0, colIndex: 1 },
        { pair: ["Performa", "Harga"], rowIndex: 0, colIndex: 2 },
        { pair: ["Kualitas Video", "Harga"], rowIndex: 0, colIndex: 3 },
        { pair: ["Kemudahan Penggunaan", "Harga"], rowIndex: 0, colIndex: 4 },
        { pair: ["Performa", "Kualitas Gambar"], rowIndex: 1, colIndex: 2 },
        { pair: ["Kualitas Video", "Kualitas Gambar"], rowIndex: 1, colIndex: 3 },
        { pair: ["Kemudahan Penggunaan", "Kualitas Gambar"], rowIndex: 1, colIndex: 4 },
        { pair: ["Kualitas Video", "Performa"], rowIndex: 2, colIndex: 3 },
        { pair: ["Kemudahan Penggunaan", "Performa"], rowIndex: 2, colIndex: 4 },
        { pair: ["Kemudahan Penggunaan", "Kualitas Video"], rowIndex: 3, colIndex: 4 },
      ],
    },
    imageQuality: {
      title: "Perbandingan Subkriteria Kualitas Gambar",
      pairs: [
        { pair: ["Resolusi Maksimal", "Pixel"], rowIndex: 0, colIndex: 1 },
        { pair: ["Ukuran Sensor", "Pixel"], rowIndex: 0, colIndex: 2 },
        { pair: ["Ukuran Sensor", "Resolusi Maksimal"], rowIndex: 1, colIndex: 2 },
      ],
    },
    performance: {
      title: "Perbandingan Subkriteria Performa",
      pairs: [
        { pair: ["ISO (maks)", "ISO (min)"], rowIndex: 0, colIndex: 1 },
        { pair: ["Shutter Speed (min)", "ISO (min)"], rowIndex: 0, colIndex: 2 },
        { pair: ["Shutter Speed (maks)", "ISO (min)"], rowIndex: 0, colIndex: 3 },
        { pair: ["Continues Drive", "ISO (min)"], rowIndex: 0, colIndex: 4 },
        { pair: ["Shutter Speed (min)", "ISO (maks)"], rowIndex: 1, colIndex: 2 },
        { pair: ["Shutter Speed (maks)", "ISO (maks)"], rowIndex: 1, colIndex: 3 },
        { pair: ["Continues Drive", "ISO (maks)"], rowIndex: 1, colIndex: 4 },
        { pair: ["Shutter Speed (maks)", "Shutter Speed (min)"], rowIndex: 2, colIndex: 3 },
        { pair: ["Continues Drive", "Shutter Speed (min)"], rowIndex: 2, colIndex: 4 },
        { pair: ["Continues Drive", "Shutter Speed (maks)"], rowIndex: 3, colIndex: 4 },
      ],
    },
    videoQuality: {
      title: "Perbandingan Subkriteria Kualitas Video",
      pairs: [{ pair: ["Video FPS", "Video Resolusi (maks)"], rowIndex: 0, colIndex: 1 }],
    },
    easeOfUse: {
      title: "Perbandingan Subkriteria Kemudahan Penggunaan",
      pairs: [
        { pair: ["Articulated LCD", "Battery Life"], rowIndex: 0, colIndex: 1 },
        { pair: ["Screen Dots", "Battery Life"], rowIndex: 0, colIndex: 2 },
        { pair: ["Berat", "Battery Life"], rowIndex: 0, colIndex: 3 },
        { pair: ["Screen Dots", "Articulated LCD"], rowIndex: 1, colIndex: 2 },
        { pair: ["Berat", "Articulated LCD"], rowIndex: 1, colIndex: 3 },
        { pair: ["Berat", "Screen Dots"], rowIndex: 2, colIndex: 3 },
      ],
    },
  };

  // Fungsi untuk menangani perubahan nilai slider
  const handleSliderChange = (value, criteriaKey, rowIndex, colIndex) => {
    // console.log(`Slider changed: ${criteriaKey} [${rowIndex}, ${colIndex}] = ${value}`);

    if (!pairwiseValues[criteriaKey] || !pairwiseValues[criteriaKey][rowIndex]) {
      console.warn(`Invalid criteriaKey or indices: ${criteriaKey}, row ${rowIndex}, col ${colIndex}`);
      return;
    }

    setPairwiseValues((prevValues) => {
      const updatedValues = {
        ...prevValues,
        [criteriaKey]: prevValues[criteriaKey].map((row, rIdx) =>
          row.map((cell, cIdx) => {
            // Perbarui hanya elemen yang relevan
            if (rIdx === rowIndex && cIdx === colIndex) {
              return value;
            }
            return cell;
          })
        ),
      };
      return updatedValues;
    });
  };

  const renderBoxStyle = (criteriaKey) => {
    if (!isCalculated) {
      return "bg-white"; // Warna default sebelum perhitungan dijalankan
    }
    const status = consistencyStatus[criteriaKey];
    return status === "CONSISTENT" || status === "NOT APPLICABLE" ? "bg-green-300" : "bg-red-500";
  };

  const flattenFinalWeights = (nestedWeights) => {
    const flattenedWeights = {};

    if (nestedWeights.price && nestedWeights.price.price !== undefined) {
      flattenedWeights.price_weight = nestedWeights.price.price;
    }

    if (nestedWeights.imageQuality) {
      flattenedWeights.pixel_weight = nestedWeights.imageQuality.pixel;
      flattenedWeights.max_resolution_weight = nestedWeights.imageQuality.maxResolution;
      flattenedWeights.sensor_size_weight = nestedWeights.imageQuality.sensorSize;
    }

    if (nestedWeights.performance) {
      flattenedWeights.min_iso_weight = nestedWeights.performance.isoMin;
      flattenedWeights.max_iso_weight = nestedWeights.performance.isoMax;
      flattenedWeights.min_shutter_speed_weight = nestedWeights.performance.shutterSpeedMin;
      flattenedWeights.max_shutter_speed_weight = nestedWeights.performance.shutterSpeedMax;
      flattenedWeights.continues_drive_weight = nestedWeights.performance.continuousDrive;
    }

    if (nestedWeights.videoQuality) {
      flattenedWeights.max_video_resolution_weight = nestedWeights.videoQuality.maxResolution;
      flattenedWeights.max_video_fps_weight = nestedWeights.videoQuality.maxFPS;
    }

    if (nestedWeights.easeOfUse) {
      flattenedWeights.battery_life_weight = nestedWeights.easeOfUse.batteryLife;
      flattenedWeights.articulated_lcd_weight = nestedWeights.easeOfUse.articulatedLCD;
      flattenedWeights.screen_dots_weight = nestedWeights.easeOfUse.screenDots;
      flattenedWeights.weight_weight = nestedWeights.easeOfUse.weight;
    }
    return flattenedWeights;
  };

  const checkConsistencyForAllGroups = () => {
    setIsLoading(true);

    const symmetricValues = getSymmetricPairwiseValues();
    const results = AHPServices.processAHP(symmetricValues);

    // console.log("Results from AHP calculation:", results);

    setTimeout(() => {
      const updatedConsistencyStatus = {};
      let allConsistent = true;

      Object.keys(results).forEach((criteriaKey) => {
        const status = results[criteriaKey].consistency;
        updatedConsistencyStatus[criteriaKey] = status !== undefined ? status : "CONSISTENT";
        if (
          updatedConsistencyStatus[criteriaKey] !== "CONSISTENT" &&
          updatedConsistencyStatus[criteriaKey] !== "NOT APPLICABLE"
        ) {
          allConsistent = false;
        }
      });

      setConsistencyStatus(updatedConsistencyStatus);
      setIsAllConsistent(allConsistent);
      setIsCalculated(true);

      // Cek apakah allConsistent bernilai true dan finalWeights tersedia
      if (allConsistent) {
        setFinalWeights(results.finalWeights); // Set finalWeights hanya jika allConsistent
        // console.log("Final Weights after calculation:", results.finalWeights); // Pastikan finalWeights benar
      } else {
        console.log("Not all criteria are consistent. Final weights not set.");
      }

      // console.log("Final Weights after calculation:", finalWeights);
      // console.log("Consistency status for all groups:", updatedConsistencyStatus);
      // console.log("Is all consistent:", allConsistent);

      setIsLoading(false); // Matikan overlay setelah proses selesai
    }, 1000);
  };

  // Fungsi untuk mengirimkan data ke backend
  const handleNext = async () => {
    if (isAllConsistent && finalWeights) {
      // Pastikan finalWeights ada dan konsisten
      const flattenedWeights = flattenFinalWeights(finalWeights);
      console.log("--------------------------------------------------------------------");
      console.log("Data Bobot final hasil perbandingan berpasangan:", flattenedWeights);
      axiosInstance
        .post("/ahp-weights", flattenedWeights)
        .then((response) => {
          // console.log("Bobot AHP berhasil disimpan:", response.data);
          // alert("Data berhasil disimpan di database!");
          navigate("/ranking");
        })
        .catch((error) => {
          console.error("Error menyimpan bobot AHP:", error);
          alert("Terjadi kesalahan saat menyimpan data ke database.");
        });
    } else {
      alert("Final weights belum tersedia atau data tidak konsisten.");
    }
  };

  return (
    <div>
      <div className="my-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-gray-800">Perbandingan Berpasangan</h1>
          <button onClick={handleModalToggle} className="text-blue-600 hover:text-blue-800  border-blue-600">
            <FiHelpCircle size={18} />
          </button>
        </div>
        <p className="text-gray-600 text-base w-2/3 mt-2">
          Di halaman ini, Anda dapat membandingkan kriteria secara berpasangan untuk menentukan tingkat kepentingannya.
          Proses ini akan membantu menghitung bobot setiap kriteria berdasarkan preferensi Anda.
        </p>
        <div className="mt-4 bg-yellow-300 p-4 rounded-lg ">
          <p className="mb-2">
            <strong>Saat Check Consistency, jika background berubah warna menjadi:</strong>
          </p>

          <p className="text-gray-800 font-medium">
            <span className="bg-green-300 font-semibold px-2 py-1 rounded">Hijau:</span> Perhitungan konsisten.
          </p>
          <p className="text-gray-800 font-medium mt-4">
            <span className="bg-red-500  font-semibold px-2 py-1 rounded">Merah:</span> Perhitungan belum konsisten,
            harap periksa kembali nilai input.
          </p>
        </div>
      </div>

      {Object.entries(comparisonData).map(([criteriaKey, section], index) => {
        const boxStyle = renderBoxStyle(criteriaKey);

        return (
          <section
            key={index}
            className={`mb-8 p-8 w-full border border-gray-300 rounded-lg shadow-lg ${renderBoxStyle(criteriaKey)}`}
          >
            <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
            <div className="space-y-2">
              {section.pairs.map(({ pair: [criterionA, criterionB], rowIndex, colIndex }, idx) => (
                <div key={idx} className="flex items-center space-x-4">
                  <PairwiseSlider
                    criterionA={criterionA}
                    criterionB={criterionB}
                    criteriaKey={criteriaKey} // Tambahkan nama kriteria utama
                    rowIndex={rowIndex}
                    colIndex={colIndex}
                    onValueChange={handleSliderChange}
                  />
                </div>
              ))}
            </div>

            {/* Alert untuk ketidakkonsistenan */}
            {boxStyle === "bg-red-500" && (
              <div className="mt-4 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-md flex items-center space-x-2">
                <FiAlertCircle />
                <p>Perbandingan ini tidak konsisten. Harap tinjau kembali nilai preferensi Anda.</p>
              </div>
            )}
          </section>
        );
      })}

      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="flex items-center">
            <svg
              className="animate-spin h-8 w-8 text-blue-500 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span className="text-blue-500 font-semibold text-lg">Processing...</span>
          </div>
        </div>
      )}
      <div className="space-x-6">
        <button
          onClick={checkConsistencyForAllGroups}
          disabled={isLoading}
          className={`px-6 py-2 font-semibold rounded text-white transition ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLoading ? "Processing..." : "Check Consistency"}
        </button>
        <button
          onClick={handleNext}
          disabled={!isAllConsistent}
          className={` px-6 py-2 text-white font-semibold rounded transition ${
            isAllConsistent ? "bg-green-500 hover:bg-green-600" : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl">
            <h2 className="text-xl font-semibold text-gray-800">Tips Mendapatkan Nilai Konsisten</h2>
            <p className="text-gray-600 mt-2">
              Berikut adalah beberapa tips untuk memastikan nilai perbandingan Anda konsisten dan sesuai dengan
              preferensi:
            </p>
            <ul className="list-disc list-outside mt-4 px-4 space-y-2 text-gray-600">
              <li>Fokus pada satu kriteria utama saat memberikan nilai perbandingan.</li>
              <li>Berikan nilai secara bertahap, hindari nilai yang terlalu ekstrem kecuali benar-benar dibutuhkan.</li>
              <li>
                Pastikan preferensi Anda logis, misalnya jika A lebih penting dari B, dan B lebih penting dari C, maka A
                harus lebih penting dari C.
              </li>
              <li>
                Jika nilai konsistensi masih merah, evaluasi ulang apakah preferensi Anda sudah mencerminkan kebutuhan
                yang sebenarnya.
              </li>
              <li>Gunakan slider dengan hati-hati, perhatikan perbandingan antar kriteria yang saling terkait.</li>
            </ul>
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

export default PairwiseComparisonPage;
