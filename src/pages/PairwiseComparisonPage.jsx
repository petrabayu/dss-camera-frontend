import React, { useState } from "react";
import PairwiseSlider from "../components/PairwiseSlider";
import AHPServices from "../services/AHPServices";

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

  const makeSymmetricMatrix = (matrix) => {
    const size = matrix.length;
    const symmetricMatrix = matrix.map((row) => [...row]); // Salin matriks untuk diubah

    for (let i = 0; i < size; i++) {
      for (let j = i + 1; j < size; j++) {
        // Isi nilai kebalikannya di posisi [j][i]
        symmetricMatrix[j][i] = 1 / symmetricMatrix[i][j];
      }
    }

    return symmetricMatrix;
  };

  const getSymmetricPairwiseValues = () => {
    const transformedValues = getTransformedPairwiseValues();
    const symmetricValues = {};

    for (const [criteriaKey, matrix] of Object.entries(transformedValues)) {
      symmetricValues[criteriaKey] = makeSymmetricMatrix(matrix);
    }

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

  const startAHPCalculation = () => {
    const symmetricValues = getSymmetricPairwiseValues();
    console.log("Final pairwiseValues for new AHP Calculation:", symmetricValues);
    const results = AHPServices.processAHP(symmetricValues);
    console.log("AHP Calculation Results:", results);

    const updatedConsistencyStatus = {};
    Object.keys(results).forEach((criteriaKey) => {
      updatedConsistencyStatus[criteriaKey] = results[criteriaKey].consistency;
    });
    setConsistencyStatus(updatedConsistencyStatus);
    console.log("Status Konsistensi", updatedConsistencyStatus);
    setIsCalculated(true);
  };

  // const renderBoxStyle = (criteriaKey) => {
  //   return consistencyStatus[criteriaKey] ? "bg-green-300" : "bg-red-500";
  // };

  const renderBoxStyle = (criteriaKey) => {
    if (!isCalculated) {
      return "bg-white"; // Warna default sebelum perhitungan dijalankan
    }
    const status = consistencyStatus[criteriaKey];
    return status === "CONSISTENT" || status === "NOT APPLICABLE" ? "bg-green-300" : "bg-red-500";
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Pairwise Comparison</h1>

      {Object.entries(comparisonData).map(([criteriaKey, section], index) => (
        <section
          key={index}
          className={`mb-8 p-8 w-[500px] border border-gray-300 rounded-lg shadow-lg ${renderBoxStyle(criteriaKey)}`}
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
          {/* {!consistencyStatus[criteriaKey] && (
            <div className="mt-4 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-md">
              <p>This comparison is not consistent. Please review the values.</p>
            </div>
          )} */}
        </section>
      ))}
      <button
        onClick={startAHPCalculation}
        className="mt-6 px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
      >
        Mulai Perhitungan AHP
      </button>
    </div>
  );
};

export default PairwiseComparisonPage;

// const matrices = {
//   mainCriteria: [
//     // Matriks perbandingan berpasangan untuk kriteria utama
//     [1, 3, 0.5, 2, 4],
//     [0.333, 1, 0.2, 0.5, 3],
//     [2, 5, 1, 4, 6],
//     [0.5, 2, 0.25, 1, 3],
//     [0.25, 0.333, 0.167, 0.333, 1],
//   ],
//   harga: [
//     // Matriks perbandingan berpasangan untuk subkriteria harga
//     [1],
//   ],
//   kualitasGambar: [
//     // Matriks perbandingan berpasangan untuk subkriteria kualitas gambar
//     [1, 4, 3],
//     [0.25, 1, 0.5],
//     [0.333, 2, 1],
//   ],
//   performa: [
//     // Matriks perbandingan berpasangan untuk subkriteria performa
//     [1, 2, 3, 4, 5], // ISO (min) dibandingkan dengan yang lain
//     [0.5, 1, 2, 3, 4], // ISO (maks)
//     [0.333, 0.5, 1, 2, 3], // Shutter Speed (min)
//     [0.25, 0.333, 0.5, 1, 2], // Shutter Speed (maks)
//     [0.2, 0.25, 0.333, 0.5, 1], // Continuous Drive
//   ],
//   kualitasVideo: [
//     // Matriks perbandingan berpasangan untuk subkriteria kualitas video
//     [1, 2],
//     [0.5, 1],
//   ],
//   kemudahanPenggunaan: [
//     // Matriks perbandingan berpasangan untuk subkriteria kemudahan penggunaan
//     [1, 0.5, 2, 3],
//     [2, 1, 4, 5],
//     [0.5, 0.25, 1, 2],
//     [0.333, 0.2, 0.5, 1],
//   ],
// };

// kode yang berhasil tapi saat matriks pebandingan masih hardcode
// return (
//   <div className="p-4">
//     <h1 className="text-2xl font-bold mb-6">Pairwise Comparison</h1>

//     {Object.values(comparisonData).map((section, index) => (
//       <section key={index} className="mb-8 p-8 border border-gray-300 rounded-lg shadow-lg bg-white w-fit ">
//         <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
//         <div className="space-y-2">
//           {section.pairs.map(([criterionA, criterionB], idx) => (
//             <div key={idx} className="flex items-center space-x-4">
//               <PairwiseSlider
//                 criterionA={criterionA}
//                 criterionB={criterionB}
//                 onValueChange={(value) => handleSliderChange(value, criterionA, criterionB)}
//               />
//             </div>
//           ))}
//         </div>
//       </section>
//     ))}
//     <button
//       onClick={startAHPCalculation} // Ganti dengan fungsi perhitungan AHP sesungguhnya
//       className="mt-6 px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
//     >
//       Mulai Perhitungan AHP
//     </button>
//   </div>
// );
