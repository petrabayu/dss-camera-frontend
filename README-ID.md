Baca ini dalam bahasa lain: [English](README.md)

Repository Backend: [Backend](https://github.com/petrabayu/dss-camera-backend)

# Sistem Pendukung Keputusan untuk Pemilihan Kamera Digital (Frontend)

## **Deskripsi**

Aplikasi Sistem Pendukung Keputusan berbasis web yang dirancang untuk membantu pengguna dalam memilih kamera digital yang paling sesuai berdasarkan beberapa kriteria seperti kualitas gambar, performa, harga, kualitas video, dan kemudahan penggunaan. Aplikasi ini memanfaatkan metode Analytical Hierarchy Process (AHP) untuk pembobotan kriteria dan metode Technique for Order Preference by Similarity to Ideal Solution (TOPSIS) untuk pemeringkatan akhir.

## **Tangkapan Layar**

![Halaman Perbandingan Berpasangan](src\assets\pairwise-comparison.webp)

![Halaman Rangking](src\assets\ranking-1.webp)

![Halaman Rangking](src\assets\ranking-2.webp)

## **Fitur**

- CRUD Kamera Digital,
- Perbandingan Berpasangan menggunakan metode AHP,
- Pemeringkatan kamera terbaik berdasarkan preferensi menggunakan metode TOPSIS.

## **Tech Stack**

- **Frontend:** React Vite, Tailwind, Axios, ChartJs,
- **Backend:** NodeJS, ExpressJS,
- **Database:** MySQL.

## **Instalasi**

1. Pastikan Anda telah mengkloning dan menjalankan program backend terlebih dahulu: [SPK-Backend](https://github.com/petrabayu/dss-camera-backend),
2. Server Backend berjalan pada http://localhost:3000 secara bawaan,
   > **CATATAN:** Jika Anda lebih suka menggunakan port yang berbeda, silakan perbarui port backend dan sesuaikan API endpoint pada bagian frontend juga.
3. Selanjutnya, clone dan jalankan frontend dengan mengikuti instruksi dibawah ini:

```bash
git clone https://github.com/petrabayu/dss-camera-frontend.git

cd dss-camera-frontend

npm install

npm run dev
```

4. Program akan berjalan pada `http://localhost:5173/` secara bawaan.

## **Kontak**

**Dibuat oleh petrabayu - [LinkedIn](https://www.linkedin.com/in/petrabayu/) - petrabayu19@gmail.com**
