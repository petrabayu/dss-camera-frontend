import React from "react";
import { FiHelpCircle } from "react-icons/fi";

const HowToUsePage = () => {
  return (
    <>
      <div className="bg-gray-100 h-full flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-lg p-4 px-8 max-w-5xl">
          <h1 className="text-3xl font-bold text-gray-800 text-center">Cara Menggunakan</h1>
          <div className="">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Langkah-Langkah:</h2>
            <ol className="list-decimal list-outside mt-4 px-4 space-y-2 text-gray-600">
              <li>
                <strong>Mulai Perhitungan:</strong> Pada halaman <strong>Beranda</strong>, tekan tombol{" "}
                <strong>"Mulai Perhitungan"</strong> untuk memulai proses seleksi kamera.
              </li>
              <li>
                <strong>Pilih Kamera untuk Dibandingkan:</strong> Anda akan diarahkan ke halaman{" "}
                <strong>"Pilih Kamera"</strong>.
                <ul className="list-disc list-outside mt-2 ml-4 space-y-1">
                  <li>
                    Pilih minimal <strong>2 kamera</strong> dengan mencentang kotak (checkbox) di sebelah nama kamera.
                  </li>
                  <li>
                    Jika kamera yang diinginkan belum ada, masuk ke menu <strong>"Daftar Kamera"</strong>, klik tombol{" "}
                    <strong>"Add Camera"</strong>, dan tambahkan kamera baru.
                  </li>
                  <li>
                    Setelah memilih kamera, tekan tombol <strong>"Next"</strong> untuk melanjutkan.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Masukkan Nilai Perbandingan Berpasangan:</strong> Anda akan diarahkan ke halaman{" "}
                <strong>"Perbandingan Berpasangan"</strong>.
                <ul className="list-disc list-outside mt-2 ml-4 space-y-1">
                  <li>Isi nilai preferensi antar kriteria menggunakan slider yang tersedia.</li>
                  <li>
                    Tekan tombol <strong>"Check Consistency"</strong> untuk memeriksa konsistensi input Anda.
                  </li>
                  <li>
                    Jika latar belakang berwarna hijau, nilai sudah konsisten. Jika merah, sesuaikan nilai hingga latar
                    belakang berubah menjadi hijau.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Lanjutkan ke Hasil Ranking:</strong> Setelah semua nilai konsisten, tekan tombol{" "}
                <strong>"Next"</strong> untuk melanjutkan ke halaman <strong>"Peringkat"</strong>.
              </li>
              <li>
                <strong>Lihat Hasil Akhir:</strong> Di halaman <strong>"Peringkat"</strong>, tekan tombol{" "}
                <strong>"Show Results"</strong> untuk melihat hasil akhir ranking kamera. Kamera dengan skor tertinggi
                adalah rekomendasi terbaik.
              </li>
              <li>
                <strong>Bantuan:</strong> di beberapa halaman akan terdapat ikon{" "}
                <span className="mx-1 inline-flex items-center">
                  <FiHelpCircle />
                </span>{" "}
                yang mana fungsi dari ikon tersebut untuk memberikan bantuan atau informasi tambahan pada halaman
                tersebut. Klik ikon tersebut untuk informasi lebih lanjut.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowToUsePage;
