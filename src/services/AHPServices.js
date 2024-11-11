const AHPServices = {
  nilaiIRSaaty: {
    1: 0.0,
    2: 0.0,
    3: 0.58,
    4: 0.9,
    5: 1.12,
    6: 1.24,
    7: 1.32,
    8: 1.41,
    9: 1.45,
    10: 1.49,
    11: 1.51,
    12: 1.48,
    13: 1.56,
    14: 1.57,
    15: 1.59,
  },

  normalizeMatrix: (matrix) => {
    // Langkah 1: Hitung jumlah dari tiap kolom
    const sumColumns = [];

    for (let col = 0; col < matrix[0].length; col++) {
      let sum = 0;
      for (let row = 0; row < matrix.length; row++) {
        sum += matrix[row][col]; // Menambahkan elemen dari tiap baris di kolom tersebut
      }
      sumColumns.push(sum); // Tambahkan hasil penjumlahan ke array sumColumns
    }

    console.log("Hasil Penjumlahan Tiap Kolom Matriks Berpasangan:", sumColumns);

    // Langkah 2: Bagi tiap elemen matriks dengan jumlah kolom yang sesuai
    const normalizedMatrix = [];
    for (let row = 0; row < matrix.length; row++) {
      const normalizedRow = [];
      for (let col = 0; col < matrix[row].length; col++) {
        const normalizedValue = matrix[row][col] / sumColumns[col];
        normalizedRow.push(normalizedValue);
      }
      normalizedMatrix.push(normalizedRow);
    }
    return normalizedMatrix;
  },

  avgPerRowCalculation: (matrix) => {
    const avgPerRow = matrix.map((row) => {
      const sum = row.reduce((sum, value) => sum + value, 0);
      return sum / row.length;
    });

    return avgPerRow;
  },

  consistencyCalculation: (matrix, weights) => {
    const consistencyTable = [];
    for (let row = 0; row < matrix.length; row++) {
      const rowResult = [];
      for (let col = 0; col < matrix[row].length; col++) {
        // Mengalikan elemen matriks dengan rata-rata baris yang sesuai
        const multiplication = matrix[row][col] * weights[col];
        rowResult.push(multiplication);
      }
      consistencyTable.push(rowResult);
    }
    return consistencyTable;
  },

  sumMatrixConsistencyCalculation: (matrix) => {
    return matrix.map((row) => {
      const sum = row.reduce((sum, value) => sum + value, 0);
      return sum;
    });
  },

  lambdaMaxCalculation: (sum, weights) => {
    const lambdaVector = [];
    for (let i = 0; i < sum.length; i++) {
      let result = sum[i] / weights[i];
      lambdaVector.push(result);
    }
    console.log("Hasil =sum/bobot kriteri:", lambdaVector);

    const totalSum = lambdaVector.reduce((sum, nilai) => sum + nilai, 0);
    const lambdaMax = totalSum / lambdaVector.length;

    return lambdaMax;
  },

  CIandCRCalculation: (lambdaMax, matrix) => {
    const CI = (lambdaMax - matrix.length) / (matrix.length - 1);
    console.log("CI:", CI);
    const CR = CI / AHPServices.nilaiIRSaaty[matrix.length];
    console.log("CR:", CR);

    return CR < 0.1 ? "CONSISTENT" : "NOT CONSISTENT";
  },

  processAHP: (matrices) => {
    const results = {
      mainCriteria: {},
      subCriteria: {},
      finalWeights: {},
    };

    for (const [key, matrix] of Object.entries(matrices)) {
      console.log(`Processing AHP for: ${key}`);

      // Normalisasi matriks
      const normalizedMatrix = AHPServices.normalizeMatrix(matrix);
      console.log("Normalized Matrix:", normalizedMatrix);

      // Hitung rata-rata per baris
      const avgPerRow = AHPServices.avgPerRowCalculation(normalizedMatrix);
      console.log("Average per Row:", avgPerRow);

      let consistencyResult = "NOT APPLICABLE";
      if (matrix.length > 2) {
        // Perhitungan konsistensi
        const consistencyTable = AHPServices.consistencyCalculation(matrix, avgPerRow);
        const sumConsistencyTable = AHPServices.sumMatrixConsistencyCalculation(consistencyTable);
        const lambdaMax = AHPServices.lambdaMaxCalculation(sumConsistencyTable, avgPerRow);

        // Cek konsistensi matriks menggunakan IR Saaty
        consistencyResult = AHPServices.CIandCRCalculation(lambdaMax, matrix);
        console.log("Consistency Result:", consistencyResult);
      }

      // Pisahkan mainCriteria dan subCriteria
      if (key === "mainCriteria") {
        results.mainCriteria = avgPerRow; // Simpan bobot utama
      } else {
        results.subCriteria[key] = avgPerRow; // Simpan bobot subkriteria
      }
      // Simpan hasil untuk matriks ini
      results[key] = {
        weights: avgPerRow,
        consistency: consistencyResult,
      };
    }

    const finalWeights = {};

    finalWeights.price = { price: results.mainCriteria.weights[0] };
    finalWeights.imageQuality = {
      pixel: results.mainCriteria.weights[1] * results.subCriteria.imageQuality[0],
      maxResolution: results.mainCriteria.weights[1] * results.subCriteria.imageQuality[1],
      sensorSize: results.mainCriteria.weights[1] * results.subCriteria.imageQuality[2],
    };
    finalWeights.performance = {
      isoMin: results.mainCriteria.weights[2] * results.subCriteria.performance[0],
      isoMax: results.mainCriteria.weights[2] * results.subCriteria.performance[1],
      shutterSpeedMin: results.mainCriteria.weights[2] * results.subCriteria.performance[2],
      shutterSpeedMax: results.mainCriteria.weights[2] * results.subCriteria.performance[3],
      continuousDrive: results.mainCriteria.weights[2] * results.subCriteria.performance[4],
    };
    finalWeights.videoQuality = {
      maxResolution: results.mainCriteria.weights[3] * results.subCriteria.videoQuality[0],
      maxFPS: results.mainCriteria.weights[3] * results.subCriteria.videoQuality[1],
    };
    finalWeights.easeOfUse = {
      batteryLife: results.mainCriteria.weights[4] * results.subCriteria.easeOfUse[0],
      articulatedLCD: results.mainCriteria.weights[4] * results.subCriteria.easeOfUse[1],
      screenDots: results.mainCriteria.weights[4] * results.subCriteria.easeOfUse[2],
      weight: results.mainCriteria.weights[4] * results.subCriteria.easeOfUse[3],
    };

    results.finalWeights = finalWeights;

    // console.log("Bobot Final:", finalWeights);
    console.log("Result secara keseluruhan:", results);
    console.log("results SubCriteria: ", results.subCriteria);
    console.log("results Main Criteria: ", results.mainCriteria);
    console.log("results Bobot Final: ", results.finalWeights);

    return results; // Kembalikan hasil akhir untuk semua matriks
  },
};

export default AHPServices;
