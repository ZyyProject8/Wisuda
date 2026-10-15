# 🎓 Website Undangan Digital Wisuda & Pelepasan Siswa - SMK Negeri 1

Projek Tugas / Portofolio **Rekayasa Perangkat Lunak (RPL)** berupa aplikasi web undangan digital interaktif dan responsif untuk acara Wisuda & Pelepasan Siswa Angkatan 2026. Dilengkapi sistem personalisasi tamu, background music, integrasi database Supabase (RSVP & Buku Tamu real-time), serta Panel Admin lengkap dengan Link Generator WhatsApp otomatis.

---

## 🌟 Fitur Utama

### 1. Halaman Undangan Tamu (`/`)
- **Gate Cover Interaktif**: Halaman pembuka elegan dengan nama tamu yang dipersonalisasi. Tombol "Buka Undangan" memicu animasi transisi dan pemutaran musik instrumen otomatis.
- **Floating Music Player**: Tombol melayang di pojok kanan bawah untuk memutar atau menjeda instrumen audio dengan animasi putaran piringan musik.
- **Hitung Mundur Acara (Countdown Timer)**: Penghitungan mundur real-time menuju tanggal dan jam prosesi wisuda.
- **Informasi Acara Lengkap**: Tanggal & waktu, lokasi gedung, tautan langsung ke Google Maps, dress code resmi, dan susunan rundown acara.
- **Formulir Konfirmasi Kehadiran (RSVP)**: Formulir interaktif untuk konfirmasi kehadiran, jumlah tamu pengiring (pax), dan kolom ucapan/doa.
- **Buku Tamu / Live Wishes Feed**: Menampilkan pesan, doa, dan status kehadiran dari tamu undangan secara dinamis langsung dari database Supabase.

### 2. Panel Admin & Pengelola (`/admin`)
- **Proteksi Akses (Autentikasi)**: Akses dilindungi kata sandi khusus panitia / admin.
- **Statistik & Ringkasan Kehadiran**: Kartu metrik total konfirmasi, jumlah hadir, ragu-ragu, tidak hadir, serta estimasi total porsi/kursi (pax) yang terisi.
- **Tabel Data RSVP & Pencarian**: Filter pencarian real-time berdasarkan nama tamu atau kelas, serta aksi hapus data.
- **Generator Tautan Undangan & Pesan WhatsApp**: Otomatis menghasilkan URL khusus (`?to=Nama&kelas=Kelas`) dan template pesan undangan resmi WhatsApp yang siap dibagikan hanya dengan satu klik *Salin*.

---

## 🛠️ Teknologi yang Digunakan (Tech Stack)

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework** | [Next.js](https://nextjs.org/) (v16 Turbopack) | Server Components & App Router |
| **Library UI** | [React](https://react.dev/) (v19) | Komponen UI reaktif dan state management |
| **Database & Backend** | [Supabase](https://supabase.com/) | Real-time PostgreSQL BaaS untuk penyimpanan data RSVP |
| **Animasi** | [Framer Motion](https://www.framer.com/motion/) | Transisi halus, cover gate exit, fade-in on scroll |
| **Ikon** | [Lucide React](https://lucide.dev/) | Icon pack modern dan konsisten |
| **Styling** | Vanilla CSS Modern (`globals.css`) | Desain kustom berkelas (palet dark gold luxury & glassmorphism) |

---

## 🚀 Panduan Menjalankan Proyek Secara Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) (versi 18.x atau lebih baru)
- npm atau pnpm

### Langkah Instalasi
1. **Clone atau buka folder proyek:**
   ```bash
   cd UndanganDigital
   ```

2. **Instal seluruh dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan (Development):**
   ```bash
   npm run dev
   ```
   Buka peramban di [http://localhost:3000](http://localhost:3000).

4. **Kunjungi Halaman:**
   - Halaman Utama (Undangan Tamu): `http://localhost:3000?to=Budi+Santoso&kelas=XII+RPL+1`
   - Halaman Administrator: `http://localhost:3000/admin` *(Password default: `admin`)*

5. **Build untuk Produksi:**
   ```bash
   npm run build
   npm start
   ```

---

## 🗄️ Struktur Tabel Supabase (`rsvps`)

Jika ingin mengatur tabel di proyek Supabase baru, gunakan skema SQL berikut:

```sql
CREATE TABLE rsvps (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  student_class VARCHAR(100) DEFAULT '-',
  attendance VARCHAR(20) NOT NULL, -- 'yes', 'maybe', 'no'
  pax INT DEFAULT 1,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Atur Row Level Security (RLS) jika diperlukan
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Izinkan publik membaca pesan (Buku Tamu)
CREATE POLICY "Public Read RSVP" ON rsvps FOR SELECT USING (true);

-- Izinkan publik mengirim konfirmasi
CREATE POLICY "Public Insert RSVP" ON rsvps FOR INSERT WITH CHECK (true);
```

---

## 📁 Struktur Direktori Proyek

```text
UndanganDigital/
├── public/                 # Aset statis & ikon
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.jsx    # Halaman Dashboard Admin & Link Generator
│   │   ├── globals.css     # Design system, variabel CSS & tema
│   │   ├── layout.jsx      # Root layout & meta tags SEO
│   │   └── page.jsx        # Halaman utama undangan interaktif
│   ├── assets/             # Gambar & aset grafis
│   └── supabaseClient.js   # Konfigurasi koneksi klien Supabase
├── package.json            # Daftar pustaka & skrip
└── README.md               # Dokumentasi proyek
```

---

## 👨‍💻 Pengembang
Projek ini dikembangkan sebagai karya penugasan / ujian keahlian jurusan **Rekayasa Perangkat Lunak (RPL)** - SMK Negeri 1.
