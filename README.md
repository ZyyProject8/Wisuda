# 🎓 Undangan Digital Wisuda — SMK Negeri 6 Surakarta
> **Projek Ujian Akhir Keahlian Rekayasa Perangkat Lunak (RPL)**  
> Acara Sidang Terbuka Wisuda & Pelepasan Siswa-Siswi **Angkatan 2024/2027**  
> **SMK Negeri 6 Surakarta**

---

## 📌 1. Latar Belakang & Ringkasan Projek

Projek ini merupakan aplikasi web modern yang dibangun untuk mendigitalkan proses publikasi undangan dan manajemen kehadiran (RSVP) pada acara Sidang Terbuka Wisuda & Pelepasan Siswa SMK Negeri 6 Surakarta Angkatan 2024/2027.

Dengan memanfaatkan teknologi web modern berbasis **Next.js (App Router)** dan **Supabase (PostgreSQL Cloud)**, aplikasi ini menggantikan undangan cetak konvensional menjadi solusi *paperless* yang interaktif, elegan, efisien, serta memudahkan panitia dalam mendata kehadiran wisudawan dan wali murid secara *real-time*.

---

## ✨ 2. Fitur-Fitur Utama

### A. Halaman Undangan Siswa & Tamu (`/`)
1. **Interactive Opening Gate (Cover Gate Angkatan)**
   - Sambutan resmi yang elegan ditujukan kepada seluruh siswa-siswi dan orang tua/wali murid Angkatan 2024/2027 SMK Negeri 6 Surakarta.
   - Tombol *"Buka Undangan"* membuka animasi tirai transisi yang halus dan responsif.
2. **Countdown Timer Interaktif**
   - Penghitungan waktu mundur presisi (*Hari, Jam, Menit, Detik*) menuju waktu prosesi wisuda (Sabtu, 20 Juni 2027, 07:30 WIB).
3. **Detail Acara & Google Maps Interaktif Tertanam**
   - Lokasi resmi: **Gedung SMK Negeri 6 Surakarta**, Jl. Adi Sucipto No. 38, Kelurahan Kerten, Kecamatan Laweyan, Kota Surakarta, Jawa Tengah.
   - **Peta Interaktif Langsung (Embedded Google Maps)**: Ditampilkan langsung di dalam halaman web sehingga pengguna dapat melihat lokasi, memperbesar/memperkecil peta, dan menekan tombol navigasi rute ke aplikasi Google Maps secara instan.
4. **Rundown Acara & Tata Tertib Resmi**
   - Susunan jadwal bertahap dari registrasi, sidang terbuka, prosesi pengalungan medali, hingga ramah tamah.
   - Ketentuan resmi berpakaian: seragam putih dan almamater SMK Negeri 6 Surakarta bagi wisudawan, batik/kebaya bagi orang tua, serta alokasi maksimal 3 kursi.
5. **Formulir RSVP Siswa & Wali Murid (Input Teks Bersih)**
   - **Ketik Nama & Kelas**: Siswa cukup mengetikkan nama lengkapnya dan kelas/jurusannya secara langsung pada kolom input teks yang bersih dan elegan (tanpa tombol pilihan cepat yang memadati layar).
   - **Verifikasi 16 Calon Wisudawan Resmi**: Sistem memvalidasi nama terhadap data 16 calon wisudawan resmi SMK 6. Nama di luar daftar resmi tidak dapat mengirim formulir.
   - **Pencegahan Duplikasi (1 Siswa = 1 Kali Konfirmasi)**: Jika nama yang diketik sudah pernah mengisi konfirmasi, sistem langsung mengunci formulir dan menampilkan ringkasan data yang telah masuk untuk mencegah kursi ganda.
6. **Tampilan Elegan & Responsif Mobile Sempurna**
   - Tipografi yang proporsional dan nyaman dibaca di desktop maupun layar ponsel kecil (360px - 480px).
   - Tanpa audio pemutar musik latar sesuai permintaan agar pengalaman pengguna tenang, ringan, dan fokus.

---

### B. Dashboard Panel Admin Panitia (`/admin`)
1. **Sistem Autentikasi Keamanan**
   - Akses panel dilindungi oleh sistem otentikasi kata sandi terintegrasi.
   - **Kata sandi masuk admin:-
2. **6 Kartu Analitik Statistik Real-time**
   - Total Calon Wisudawan Terdaftar (Master Data).
   - Jumlah Siswa Sudah Konfirmasi.
   - Jumlah Siswa Pasti Hadir.
   - Estimasi Total Kursi & Konsumsi (*Pax*).
   - Jumlah Berhalangan Hadir.
   - Jumlah Belum Konfirmasi.
3. **Tab 1: Data Respon Kehadiran & Fitur Download PDF Khusus Admin** 📥
   - **Download Tamu Hadir (PDF)**: Tombol eksklusif panitia untuk langsung membuat dan mengunduh berkas PDF resmi (`Daftar_Resmi_Tamu_Hadir_SMK6.pdf`) berformat A4 *landscape* berisi daftar seluruh tamu & wisudawan yang mengonfirmasi **Pasti Hadir** beserta kelas, total kebutuhan kursi, pesan doa, dan tanggal konfirmasi.
   - **Download PDF Tiket Siswa**: Tombol unduh file PDF bukti kehadiran resmi perorangan (`E-Tiket_[Nama].pdf`) berformat A5 *portrait* langsung pada masing-masing baris siswa.
   - Seluruh proses ekspor PDF berjalan otomatis (*client-side*) dan langsung terunduh ke komputer/perangkat tanpa perlu melalui dialog cetak printer (*print dialog*).
   - Fitur pencarian instan (*live search filter*) berdasarkan nama atau kelas siswa.
   - Aksi hapus data konfirmasi dengan konfirmasi keamanan.
4. **Tab 2: Master Data Calon Wisudawan**
   - Tabel 16 calon wisudawan resmi beserta status langsung: *Sudah Konfirmasi (Hadir/Tidak)* atau *Belum Mengisi*.
   - **Fitur Tambah Siswa Baru**: Form untuk mendaftarkan siswa baru ke daftar wisuda.
   - **Fitur Reset Konfirmasi**: Mengizinkan siswa tertentu mengisi ulang jika sebelumnya terjadi kesalahan pengisian data.
   - **Fitur Hapus Siswa**: Menghapus siswa dari daftar master.
5. **Broadcast WhatsApp Angkatan 2024/2027**
   - Menyediakan tombol **Salin Link Undangan** dan **Salin Pesan Broadcast WhatsApp** resmi yang siap dibagikan ke grup kelas atau wali murid dalam satu kali klik.

---

## 👥 3. Daftar 16 Calon Wisudawan Resmi Terdaftar

| No. | Nama Calon Wisudawan | Kelas / Jurusan |
| :---: | :--- | :---: |
| 1 | Muhammad Ba'sin Khoirur Roziqin Raharjo | XII RPL |
| 2 | Lubaid Arfa Casilas | XII RPL |
| 3 | Donald Terrifortino | XII RPL |
| 4 | Mohammad Hilmi Azzam | XII RPL |
| 5 | Abryan Yoga Pratama | XII RPL |
| 6 | Byatara Ade Wisnu Brata | XII RPL |
| 7 | Muhammad Zidane | XII RPL |
| 8 | Alvaro Danendra Kurniawanb | XII RPL |
| 9 | Adrian Valentino | XII RPL |
| 10 | Valentino Santoso | XII RPL |
| 11 | Stefano Budi | XII RPL |
| 12 | Aziz Ahmad Juniar | XII RPL |
| 13 | Junior Alfrefo Berned | XII RPL |
| 14 | Damay Mada Setyawan | XII RPL |
| 15 | Desiderius Aditya | XII RPL |
| 16 | Kritiano Agustav | XII RPL |

---

## 🛠️ 4. Teknologi yang Digunakan (Tech Stack)

| Lapisan / Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework Utama** | [Next.js](https://nextjs.org/) 16.3 (Turbopack) | Server & Client Components dengan App Router modern |
| **Library Antarmuka** | [React](https://react.dev/) 19 | Komponen antarmuka modular, hooks reaktif & state management |
| **Database Cloud** | [Supabase](https://supabase.com/) | Real-time Cloud PostgreSQL Database & REST API |
| **Animasi & Transisi** | [Framer Motion](https://www.framer.com/motion/) | Transisi cover gate, animasi fade-in, dan fluid layout |
| **Ikonografi** | [Lucide React](https://lucide.dev/) | Kumpulan ikon vektor modern dan konsisten |
| **Desain & Styling** | Modern CSS (`globals.css`) | Glassmorphism, palet Royal Blue & Warm Gold SMK 6 |

---

## 🚀 5. Panduan Menjalankan Proyek Secara Lokal

### Prasyarat Sistem
- **Node.js** versi `18.x` atau lebih baru
- Manajer paket: **npm** atau **pnpm**
- Koneksi internet (untuk sinkronisasi database Supabase)

### Langkah-Langkah:

1. **Buka folder proyek di terminal:**
   ```bash
   cd "C:\Users\WINDOWS 11\Projek RPL\UndanganDigital"
   ```

2. **Instal seluruh dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan (*Development Mode*):**
   ```bash
   npm run dev
   ```
   Buka peramban pada alamat: [http://localhost:3000](http://localhost:3000)

4. **Kompilasi untuk Ujian / Produksi (*Production Build*):**
   ```bash
   npm run build
   npm start
   ```

---

## 🔑 6. Kredensial & Pengujian Sistem (Demo Ujian)

Untuk keperluan pengujian/penilaian oleh guru dan penguji:

| Halaman | URL Akses | Keterangan / Akses |
| :--- | :--- | :--- |
| **Halaman Utama Undangan** | `http://localhost:3000/` | Halaman undangan resmi seluruh angkatan |
| **Dashboard Panel Admin** | `http://localhost:3000/admin` | **Kata Sandi Masuk:** `wisuda24` |

---

## 🗄️ 7. Skema Basis Data Supabase (`rsvps`)

```sql
-- Pembuatan tabel konfirmasi kehadiran
CREATE TABLE rsvps (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  student_class VARCHAR(100) DEFAULT '-',
  attendance VARCHAR(20) NOT NULL, -- 'yes', 'no'
  pax INT DEFAULT 1,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Pengaturan keamanan Row Level Security (RLS)
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Kebijakan membaca data untuk umum (Buku Tamu & Dashboard)
CREATE POLICY "Public Read RSVP" ON rsvps FOR SELECT USING (true);

-- Kebijakan pengiriman formulir konfirmasi
CREATE POLICY "Public Insert RSVP" ON rsvps FOR INSERT WITH CHECK (true);

-- Kebijakan penghapusan data (Admin)
CREATE POLICY "Public Delete RSVP" ON rsvps FOR DELETE USING (true);
```

---

## 📁 8. Struktur Direktori Proyek

```text
UndanganDigital/
├── public/
│   ├── images/
│   │   ├── smk6.png              # Logo resmi SMK Negeri 6 Surakarta
│   │   ├── smk6-depan-web.jpg    # Foto gedung sekolah (dioptimasi web)
│   │   └── ...                   # Aset visual pendukung lainnya
│   ├── favicon.svg               # Favicon browser
│   └── icons.svg                 # Simbol grafis
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.jsx          # Panel Admin & Manajemen Master Siswa
│   │   ├── globals.css           # Styling lengkap, tema warna & responsivitas
│   │   ├── layout.jsx            # Layout utama & konfigurasi metadata SEO
│   │   └── page.jsx              # Beranda undangan tamu & fitur unduh PDF
│   ├── data/
│   │   └── studentsData.js       # Master data 16 calon wisudawan resmi
│   └── supabaseClient.js         # Konfigurasi koneksi klien Supabase
├── .env.example                  # Template variabel lingkungan
├── package.json                  # Dependensi pustaka dan skrip proyek
└── README.md                     # Dokumentasi teknis proyek
```

---

## 💡 9. Aspek Penilaian Kualitas Perangkat Lunak (Nilai Unggulan RPL)

Projek ini menerapkan standar kompetensi Rekayasa Perangkat Lunak:
- **Clean Architecture & Component-Based Design**: Kode modular, terstruktur, dan mudah dipelihara (*maintainable*).
- **Responsive Web Design**: Tipografi dan tata letak menggunakan fungsi `clamp()` sehingga adaptif di seluruh resolusi (*Mobile HP 360px hingga Desktop 1920px+*).
- **Data Integrity & Validation**: Validasi ketat nama terdaftar serta pencegahan duplikasi data (*1 Siswa = 1 Respon*).
- **Offline & Graceful Fallback**: Menggunakan *local storage cache* sehingga jika jaringan internet terganggu saat demo ujian, aplikasi tetap berjalan lancar tanpa galat (*error-free*).
- **Performance Optimization**: Kompilasi berbasis *Turbopack* dengan *Suspense Boundary* untuk kecepatan pemuatan halaman maksimal.

---

## 👨‍💻 10. Identitas Pengembang

- **Projek**: Ujian Praktik / Penugasan Keahlian Rekayasa Perangkat Lunak (RPL)
- **Sekolah**: **SMK Negeri 6 Surakarta**
- **Tahun Ajaran**: 2024/2027
- **Lisensi**: Edukasi & Penggunaan Internal SMK Negeri 6 Surakarta
