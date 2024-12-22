import React from "react";

const AboutPage = () => {
  return (
    <>
      <div className="p-6 bg-gray-100 h-full flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Tentang Website</h1>
          <p className="text-gray-600 leading-relaxed text-justify">
            Website ini merupakan <strong>Sistem Pendukung Keputusan (SPK)</strong> yang dirancang untuk membantu
            pengguna memilih kamera digital terbaik berdasarkan kriteria yang relevan dengan kebutuhan mereka. SPK ini
            memanfaatkan metode <strong>Analytical Hierarchy Process (AHP)</strong> dan
            <strong> Technique for Order of Preference by Similarity to Ideal Solution (TOPSIS)</strong> sebagai
            pendekatan dalam pengambilan keputusan. Setiap langkah dalam proses seleksi kamera dirancang untuk
            memastikan bahwa hasil akhir memberikan rekomendasi yang objektif, terukur, dan sesuai dengan preferensi
            pengguna.
          </p>
          <div className="text-center mt-8">
            <p className="text-gray-500 italic">
              “Website ini dirancang untuk membantu Anda dalam merekomendasikan kamera terbaik yang sesuai dengan
              kebutuhan Anda.”
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
