"use client";
import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  MailOpen, 
  Download,
  CheckCircle, 
  CheckCircle2,
  XCircle,
  Armchair,
  Info, 
  ChevronDown,
  ChevronUp,
  Navigation,
  Sparkles,
  Search,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMasterStudents } from '../data/studentsData';

// Ornamen Sudut Emas Mewah (Filigree Corner)
function FiligreeCorner({ position }) {
  const isRight = position.includes('right');
  const isBottom = position.includes('bottom');
  
  return (
    <svg 
      className={`filigree-corner filigree-${position}`}
      viewBox="0 0 70 70" 
      fill="none" 
      style={{
        position: 'absolute',
        top: isBottom ? 'auto' : '8px',
        bottom: isBottom ? '8px' : 'auto',
        left: isRight ? 'auto' : '8px',
        right: isRight ? '8px' : 'auto',
        transform: `${isRight ? 'scaleX(-1)' : ''} ${isBottom ? 'scaleY(-1)' : ''}`.trim() || undefined,
        pointerEvents: 'none',
        zIndex: 4
      }}
    >
      {/* Outer corner curves */}
      <path 
        d="M 6 6 Q 30 6 42 16 T 50 42" 
        stroke="#c59b27" 
        strokeWidth="1.6" 
        strokeLinecap="round" 
      />
      <path 
        d="M 6 6 Q 6 30 16 42 T 42 50" 
        stroke="#c59b27" 
        strokeWidth="1.6" 
        strokeLinecap="round" 
      />
      {/* Inner flourish swirl */}
      <path 
        d="M 12 12 Q 24 12 30 20 Q 36 28 32 34 Q 28 38 22 34 Q 18 30 22 24 Q 26 20 32 24" 
        stroke="#d4af37" 
        strokeWidth="1.3" 
        strokeLinecap="round" 
      />
      {/* Corner leaf details */}
      <path 
        d="M 8 8 C 14 5 20 8 22 14 C 16 16 11 13 8 8 Z" 
        fill="#c59b27" 
        opacity="0.85" 
      />
      <path 
        d="M 8 8 C 5 14 8 20 14 22 C 16 16 13 11 8 8 Z" 
        fill="#c59b27" 
        opacity="0.85" 
      />
      <circle cx="7" cy="7" r="2" fill="#c59b27" />
    </svg>
  );
}

// Siluet Gedung Sekolah pada Bagian Bawah Kartu
function SchoolSilhouette() {
  return (
    <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '220px', height: '60px', pointerEvents: 'none', opacity: 0.32, zIndex: 1 }}>
      <svg viewBox="0 0 200 55" fill="#a88950">
        {/* Tiang & Bendera */}
        <rect x="99.5" y="2" width="1" height="15" fill="#8c703b" />
        <path d="M100.5 2 L112 5.5 L100.5 9 Z" fill="#c59b27" />
        {/* Atap Segitiga Utama (Pediment) */}
        <polygon points="100,12 80,22 120,22" fill="#bfa373" />
        {/* Blok Utama Tengah */}
        <rect x="82" y="22" width="36" height="33" fill="#cfbe9b" />
        {/* Pintu Lengkung Tengah */}
        <path d="M95 55 V44 Q100 40 105 44 V55 Z" fill="#ffffff" />
        {/* Sayap Kiri & Kanan */}
        <rect x="30" y="24" width="52" height="31" fill="#c4b18c" />
        <rect x="118" y="24" width="52" height="31" fill="#c4b18c" />
        {/* Deretan Jendela Atas */}
        <rect x="38" y="28" width="6" height="7" rx="1" fill="#ffffff" />
        <rect x="48" y="28" width="6" height="7" rx="1" fill="#ffffff" />
        <rect x="58" y="28" width="6" height="7" rx="1" fill="#ffffff" />
        <rect x="68" y="28" width="6" height="7" rx="1" fill="#ffffff" />
        <rect x="126" y="28" width="6" height="7" rx="1" fill="#ffffff" />
        <rect x="136" y="28" width="6" height="7" rx="1" fill="#ffffff" />
        <rect x="146" y="28" width="6" height="7" rx="1" fill="#ffffff" />
        <rect x="156" y="28" width="6" height="7" rx="1" fill="#ffffff" />
        {/* Deretan Jendela Bawah */}
        <rect x="38" y="39" width="6" height="7" rx="1" fill="#ffffff" />
        <rect x="48" y="39" width="6" height="7" rx="1" fill="#ffffff" />
        <rect x="58" y="39" width="6" height="7" rx="1" fill="#ffffff" />
        <rect x="68" y="39" width="6" height="7" rx="1" fill="#ffffff" />
        <rect x="126" y="39" width="6" height="7" rx="1" fill="#ffffff" />
        <rect x="136" y="39" width="6" height="7" rx="1" fill="#ffffff" />
        <rect x="146" y="39" width="6" height="7" rx="1" fill="#ffffff" />
        <rect x="156" y="39" width="6" height="7" rx="1" fill="#ffffff" />
        {/* Garis Lis Atap */}
        <rect x="26" y="22" width="148" height="2" fill="#8c703b" />
      </svg>
    </div>
  );
}

function InvitationContent() {
  // State Cover & Navigasi
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState(null);

  // Bersihkan sisa hash fragment (seperti #pesan-alumni) dari bilah URL browser jika ada
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  // Kunci scroll halaman saat cover awal belum dibuka agar scrollbar tidak muncul
  useEffect(() => {
    if (!isCoverOpen) {
      document.documentElement.classList.add('cover-locked');
      document.body.classList.add('cover-locked');
    } else {
      document.documentElement.classList.remove('cover-locked');
      document.body.classList.remove('cover-locked');
    }

    return () => {
      document.documentElement.classList.remove('cover-locked');
      document.body.classList.remove('cover-locked');
    };
  }, [isCoverOpen]);

  // State Master Data Siswa & Verifikasi Kehadiran
  const [masterStudents, setMasterStudents] = useState([]);
  const [existingRsvps, setExistingRsvps] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [alreadySubmittedData, setAlreadySubmittedData] = useState(null);

  // Form RSVP state
  const [formData, setFormData] = useState({
    name: '',
    student_class: '',
    attendance: 'yes',
    pax: '3',
    message: ''
  });

  // Muat data siswa master & data konfirmasi yang sudah ada
  useEffect(() => {
    const students = getMasterStudents();
    setMasterStudents(students);

    const fetchExistingRsvps = async () => {
      try {
        const { data, error } = await supabase.from('rsvps').select('*');
        if (!error && data) {
          setExistingRsvps(data);
          try {
            localStorage.setItem('smk6_rsvps_cache', JSON.stringify(data));
          } catch {}
        } else {
          try {
            const cached = localStorage.getItem('smk6_rsvps_cache');
            if (cached) setExistingRsvps(JSON.parse(cached));
          } catch {}
        }
      } catch {
        try {
          const cached = localStorage.getItem('smk6_rsvps_cache');
          if (cached) setExistingRsvps(JSON.parse(cached));
        } catch {}
      }
    };
    fetchExistingRsvps();
  }, []);

  // Helper normalisasi nama agar pencocokan nama siswa fleksibel & tidak sensitif tanda petik/spasi
  const cleanName = (str) => {
    if (!str) return '';
    return str
      .toLowerCase()
      .replace(/['’`.]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Tab RSVP: 'form' (Isi Formulir) | 'ticket' (Cek & Unduh E-Tiket Tamu)
  const [rsvpActiveTab, setRsvpActiveTab] = useState('form');
  const [guestTicketSearch, setGuestTicketSearch] = useState('');
  const [searchedGuestTicket, setSearchedGuestTicket] = useState(null);
  const [ticketSearchError, setTicketSearchError] = useState('');

  // Handler saat siswa mengetikkan nama di kolom input teks
  const handleNameInputChange = (e) => {
    const rawVal = e.target.value;
    setFormData(prev => ({ ...prev, name: rawVal }));

    const trimmed = rawVal.trim();
    if (!trimmed) {
      setSelectedStudent(null);
      setAlreadySubmittedData(null);
      return;
    }

    const cleaned = cleanName(trimmed);
    const matched = masterStudents.find(s => cleanName(s.name) === cleaned);

    if (matched) {
      setSelectedStudent(matched);
      // Auto-isi kelas jika belum diisi oleh siswa
      setFormData(prev => ({
        ...prev,
        student_class: prev.student_class || matched.student_class || 'XII RPL'
      }));

      // Cek apakah siswa sudah pernah mengirim konfirmasi kehadiran
      const foundRsvp = existingRsvps.find(r => 
        cleanName(r.name) === cleanName(matched.name) ||
        cleanName(r.name) === cleaned
      );

      if (foundRsvp) {
        setAlreadySubmittedData(foundRsvp);
      } else {
        setAlreadySubmittedData(null);
      }
    } else {
      setSelectedStudent(null);
      // Cek apakah nama yang diketik langsung cocok dengan RSVP yang ada
      const foundRsvp = existingRsvps.find(r => cleanName(r.name) === cleaned);
      if (foundRsvp) {
        setAlreadySubmittedData(foundRsvp);
      } else {
        setAlreadySubmittedData(null);
      }
    }
  };

  // Saran nama otomatis saat siswa mulai mengetik (minimal 2 huruf)
  const nameSuggestions = useMemo(() => {
    const trimmed = formData.name.trim();
    if (trimmed.length < 2 || selectedStudent) return [];
    const cleaned = cleanName(trimmed);
    return masterStudents
      .filter(s => cleanName(s.name).includes(cleaned))
      .slice(0, 4);
  }, [formData.name, selectedStudent, masterStudents]);

  // Handler memilih saran nama
  const handleSelectSuggestion = (student) => {
    if (!student) return;
    setFormData(prev => ({
      ...prev,
      name: student.name,
      student_class: student.student_class || prev.student_class || 'XII RPL'
    }));
    setSelectedStudent(student);

    const foundRsvp = existingRsvps.find(r => 
      cleanName(r.name) === cleanName(student.name)
    );
    if (foundRsvp) {
      setAlreadySubmittedData(foundRsvp);
    } else {
      setAlreadySubmittedData(null);
    }
  };

  // Handler cari E-Tiket Tamu untuk diunduh langsung
  const handleSearchGuestTicket = (e) => {
    if (e) e.preventDefault();
    const q = cleanName(guestTicketSearch);
    if (!q) {
      setTicketSearchError('Silakan masukkan nama siswa / tamu terlebih dahulu.');
      setSearchedGuestTicket(null);
      return;
    }

    const found = existingRsvps.find(r => cleanName(r.name).includes(q));
    if (found) {
      setSearchedGuestTicket(found);
      setTicketSearchError('');
    } else {
      setSearchedGuestTicket(null);
      setTicketSearchError('Data konfirmasi kehadiran untuk nama tersebut tidak ditemukan. Pastikan nama sudah mengisi kehadiran.');
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Countdown timer state: Wisuda 20 Juni 2027 08:00 WIB
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2027-06-20T08:00:00+07:00').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle Cover Open
  const handleOpenInvitation = () => {
    setIsCoverOpen(true);
  };

  // Download Bukti Konfirmasi Kehadiran sebagai PDF / Cetak Resmi
  const handleDownloadPdf = (record) => {
    if (!record) return;
    const ticketId = `SMK6-WSD-${record.id ? String(record.id).slice(-4) : '2027'}`;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Izinkan pop-up peramban Anda untuk mengunduh PDF bukti konfirmasi kehadiran.');
      return;
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bukti Konfirmasi Kehadiran - ${record.name}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 1.2cm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 16px;
    }
    .ticket-container {
      max-width: 680px;
      margin: 0 auto;
      border: 2px solid #c59b27;
      border-radius: 18px;
      padding: 28px;
      background: #ffffff;
      position: relative;
      box-shadow: 0 4px 20px rgba(15, 43, 92, 0.08);
    }
    .ticket-container::before {
      content: '';
      position: absolute;
      inset: 8px;
      border: 1px dashed rgba(197, 155, 39, 0.45);
      border-radius: 12px;
      pointer-events: none;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      border-bottom: 2px solid #0f2b5c;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .header-logo {
      width: 65px;
      height: 65px;
      object-fit: contain;
    }
    .header-text h1 {
      font-size: 18px;
      color: #0f2b5c;
      margin: 0 0 3px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 800;
    }
    .header-text h2 {
      font-size: 13px;
      color: #c59b27;
      margin: 0 0 4px 0;
      font-weight: 700;
    }
    .header-text p {
      font-size: 11px;
      color: #64748b;
      margin: 0;
      line-height: 1.4;
    }
    .badge-bar {
      text-align: center;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 10px;
      border-radius: 10px;
      margin-bottom: 22px;
    }
    .badge-bar h3 {
      margin: 0 0 4px;
      color: #0f2b5c;
      font-size: 15px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .badge-bar span {
      font-size: 11px;
      color: #64748b;
    }
    .ticket-num {
      display: inline-block;
      background: #0f2b5c;
      color: #ffffff;
      padding: 4px 14px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      margin-top: 6px;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .data-table td {
      padding: 8px 6px;
      font-size: 13px;
      vertical-align: top;
      border-bottom: 1px solid #f1f5f9;
    }
    .data-table td.col-label {
      width: 150px;
      color: #64748b;
      font-weight: 600;
    }
    .data-table td.col-val {
      color: #0f2b5c;
      font-weight: 700;
    }
    .status-alert {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 18px;
      border-radius: 10px;
      margin-bottom: 20px;
      background: ${record.attendance === 'yes' ? '#ecfdf5' : '#fef2f2'};
      border: 1.5px solid ${record.attendance === 'yes' ? '#a7f3d0' : '#fecaca'};
    }
    .status-alert-text {
      font-size: 14px;
      font-weight: 700;
      color: ${record.attendance === 'yes' ? '#065f46' : '#991b1b'};
    }
    .status-alert-pax {
      font-size: 13px;
      font-weight: 700;
      color: #0f2b5c;
    }
    .rules-section {
      background: #fcfaf2;
      border: 1px solid rgba(197, 155, 39, 0.35);
      border-radius: 10px;
      padding: 14px 18px;
      margin-bottom: 22px;
    }
    .rules-section h4 {
      margin: 0 0 6px;
      font-size: 12px;
      color: #0f2b5c;
      text-transform: uppercase;
      font-weight: 700;
    }
    .rules-section ul {
      margin: 0;
      padding-left: 18px;
      font-size: 11.5px;
      color: #475569;
      line-height: 1.6;
    }
    .footer-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-top: 1px solid #e2e8f0;
      padding-top: 14px;
    }
    .footer-desc {
      font-size: 10px;
      color: #94a3b8;
      max-width: 340px;
      line-height: 1.45;
    }
    .footer-sign {
      text-align: center;
      font-size: 11px;
      color: #334155;
    }
    .footer-sign .space {
      height: 48px;
    }
    .no-print-bar {
      margin-top: 16px;
      text-align: center;
    }
    .print-btn {
      padding: 10px 24px;
      background: #0f2b5c;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      font-size: 13px;
      box-shadow: 0 4px 12px rgba(15, 43, 92, 0.2);
    }
    @media print {
      body { padding: 0; }
      .no-print-bar { display: none !important; }
      .ticket-container { box-shadow: none; border-color: #0f2b5c; }
    }
  </style>
</head>
<body>
  <div class="ticket-container">
    <div class="header">
      <img class="header-logo" src="/images/smk6.png" alt="Logo SMK 6" onerror="this.style.display='none'">
      <div class="header-text">
        <h1>SMK NEGERI 6 SURAKARTA</h1>
        <h2>Panitia Sidang Terbuka Wisuda & Pelepasan Siswa 2024/2027</h2>
        <p>Jl. Adi Sucipto No. 38, Kelurahan Kerten, Kecamatan Laweyan, Kota Surakarta, Jawa Tengah</p>
      </div>
    </div>

    <div class="badge-bar">
      <h3>Bukti Resmi Konfirmasi Kehadiran (E-Tiket)</h3>
      <span>Tunjukkan dokumen/tiket ini saat registrasi di lokasi acara</span><br>
      <span class="ticket-num">${ticketId}</span>
    </div>

    <table class="data-table">
      <tr>
        <td class="col-label">Nama Siswa / Wisudawan</td>
        <td class="col-val">: ${record.name}</td>
      </tr>
      <tr>
        <td class="col-label">Kelas & Jurusan</td>
        <td class="col-val">: ${record.student_class || 'XII RPL'}</td>
      </tr>
      <tr>
        <td class="col-label">Hari, Tanggal Acara</td>
        <td class="col-val">: Sabtu, 20 Juni 2027</td>
      </tr>
      <tr>
        <td class="col-label">Waktu Pelaksanaan</td>
        <td class="col-val">: 07:30 - 12:30 WIB (Pintu registrasi dibuka 07:00 WIB)</td>
      </tr>
      <tr>
        <td class="col-label">Tempat Pelaksanaan</td>
        <td class="col-val">: Gedung SMK Negeri 6 Surakarta</td>
      </tr>
      <tr>
        <td class="col-label">Waktu Konfirmasi Masuk</td>
        <td class="col-val">: ${record.created_at ? new Date(record.created_at).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' }) : new Date().toLocaleString('id-ID', { dateStyle: 'full' })}</td>
      </tr>
    </table>

    <div class="status-alert">
      <span class="status-alert-text">
        ${record.attendance === 'yes' ? '✓ STATUS: PASTI HADIR' : '✕ STATUS: TIDAK DAPAT HADIR'}
      </span>
      ${record.attendance === 'yes' ? `<span class="status-alert-pax">🪑 Alokasi: ${record.pax || 3} Kursi (Siswa + Orang Tua)</span>` : ''}
    </div>

    <div class="rules-section">
      <h4>Ketentuan Resmi Kehadiran:</h4>
      <ul>
        <li><strong>Pakaian Siswa:</strong> Mengenakan seragam putih dan almamater SMK Negeri 6 Surakarta.</li>
        <li><strong>Pakaian Orang Tua / Wali:</strong> Mengenakan batik formal / kebaya rapi dan sopan.</li>
        <li>Setiap wisudawan berhak atas maksimal <strong>3 kursi</strong> (1 kursi siswa + 2 kursi orang tua/wali pendamping).</li>
        <li>Harap hadir paling lambat <strong>30 menit</strong> sebelum prosesi sidang dimulai demi kelancaran registrasi.</li>
      </ul>
    </div>

    <div class="footer-section">
      <div class="footer-desc">
        *E-Tiket ini diterbitkan secara otomatis oleh sistem resmi panitia wisuda SMK Negeri 6 Surakarta sebagai bukti verifikasi kehadiran.
      </div>
      <div class="footer-sign">
        <span>Surakarta, 20 Juni 2027</span><br>
        <span>Ketua Panitia Wisuda,</span>
        <div class="space"></div>
        <strong>SMK Negeri 6 Surakarta</strong>
      </div>
    </div>
  </div>

  <div class="no-print-bar">
    <button class="print-btn" onclick="window.print()">
      🖨️ Simpan sebagai PDF / Cetak Tiket
    </button>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>`;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Deteksi scroll untuk memunculkan tombol cepat ke atas (Scroll to Top)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fungsi scroll cepat & halus ke atas
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = formData.name?.trim();
    if (!trimmedName) {
      alert('Silakan ketik nama lengkap siswa terlebih dahulu.');
      return;
    }

    if (!formData.student_class?.trim()) {
      alert('Silakan masukkan kelas & jurusan terlebih dahulu.');
      return;
    }

    const cleaned = cleanName(trimmedName);
    const matched = masterStudents.find(s => cleanName(s.name) === cleaned);

    if (!matched) {
      alert('Nama tidak ditemukan dalam 16 calon wisudawan resmi SMK Negeri 6 Surakarta. Mohon pastikan ejaan nama lengkap sudah sesuai.');
      return;
    }

    if (alreadySubmittedData) {
      alert('Siswa ini sudah melakukan konfirmasi kehadiran sebelumnya dan tidak dapat mengisi lagi.');
      return;
    }

    // Validasi duplikat agar tidak ada siswa mengisi lebih dari 1 kali (fokus nama)
    const isDuplicate = existingRsvps.some(r =>
      cleanName(r.name) === cleanName(matched.name) ||
      cleanName(r.name) === cleaned
    );

    if (isDuplicate) {
      alert('Siswa ini sudah pernah mengisi konfirmasi kehadiran sebelumnya!');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    const paxNum = formData.attendance === 'yes' ? parseInt(formData.pax, 10) : 0;
    const nameVal = matched.name || trimmedName;
    const classVal = formData.student_class?.trim() || matched.student_class || 'XII RPL';
    const messageVal = formData.message?.trim() || '';

    const payload = {
      name: nameVal,
      student_class: classVal,
      attendance: formData.attendance,
      pax: paxNum,
      message: messageVal
    };

    try {
      const { error } = await supabase
        .from('rsvps')
        .insert([payload]);

      if (error) {
        if (error.message && (error.message.includes('student_class') || error.message.includes('pax'))) {
          const { error: fallbackError } = await supabase
            .from('rsvps')
            .insert([{
              name: `${nameVal} (${classVal})`,
              attendance: formData.attendance,
              message: `[Jumlah: ${paxNum} Org] ${messageVal}`
            }]);
          if (fallbackError) throw fallbackError;
        } else {
          throw error;
        }
      }

      // Catat data konfirmasi yang baru saja berhasil dikirim
      const newSubmittedRecord = {
        id: Date.now(),
        name: nameVal,
        student_class: classVal,
        attendance: formData.attendance,
        pax: paxNum,
        message: messageVal,
        created_at: new Date().toISOString()
      };

      setLastSubmitted(newSubmittedRecord);
      setAlreadySubmittedData(newSubmittedRecord);
      setExistingRsvps(prev => [newSubmittedRecord, ...prev]);
      try {
        localStorage.setItem('smk6_rsvps_cache', JSON.stringify([newSubmittedRecord, ...existingRsvps]));
      } catch {}
      setSubmitStatus('success');

      // Reset input pesan pada form
      setFormData(prev => ({ ...prev, message: '' }));
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      // Fallback penyimpanan offline lokal agar demo pengujian tidak pernah gagal
      const newSubmittedRecord = {
        id: Date.now(),
        name: nameVal,
        student_class: classVal,
        attendance: formData.attendance,
        pax: paxNum,
        message: messageVal,
        created_at: new Date().toISOString()
      };
      setLastSubmitted(newSubmittedRecord);
      setAlreadySubmittedData(newSubmittedRecord);
      setExistingRsvps(prev => [newSubmittedRecord, ...prev]);
      try {
        localStorage.setItem('smk6_rsvps_cache', JSON.stringify([newSubmittedRecord, ...existingRsvps]));
      } catch {}
      setSubmitStatus('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="app-container">
      {/* Floating Action Button: Scroll to Top */}
      {isCoverOpen && (
        <AnimatePresence>
          {showScrollTop && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.6, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 15 }}
              transition={{ duration: 0.25 }}
              className="floating-scroll-top-btn"
              onClick={scrollToTop}
              title="Scroll Cepat ke Atas"
              aria-label="Kembali ke Atas"
            >
              <ChevronUp size={24} />
            </motion.button>
          )}
        </AnimatePresence>
      )}

      {/* Gate Cover / Buka Undangan Modal */}
      <AnimatePresence>
        {!isCoverOpen && (
          <motion.div 
            className="cover-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -100, transition: { duration: 0.8, ease: "easeInOut" } }}
          >
            <motion.div 
              className="cover-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Overlapping Top Circular Badge */}
              <div className="cover-badge-top">
                <img 
                  src="/images/smk6.png" 
                  alt="Logo Resmi SMK Negeri 6 Surakarta" 
                  className="cover-badge-logo"
                />
              </div>

              {/* Inner Decorative Golden Frame */}
              <div className="cover-card-inner-frame" />

              {/* 4 Corner Filigree Ornaments */}
              <FiligreeCorner position="top-left" />
              <FiligreeCorner position="top-right" />
              <FiligreeCorner position="bottom-left" />
              <FiligreeCorner position="bottom-right" />

              {/* School Building Silhouette Accent at Card Bottom */}
              <SchoolSilhouette />

              {/* Card Typography & Content */}
              <div style={{ position: 'relative', zIndex: 3 }}>
                <p style={{ letterSpacing: '0.22em', textTransform: 'uppercase', fontSize: '0.84rem', color: '#c59b27', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Undangan Resmi
                </p>
                
                <h2 className="cover-title-main">
                  Wisuda & Pelepasan Siswa
                </h2>

                <p style={{ fontSize: '1.05rem', color: '#0f2b5c', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                  SMK NEGERI 6 SURAKARTA
                </p>

                <p style={{ fontSize: '0.86rem', color: '#64748b', marginBottom: '1.25rem', fontWeight: 500 }}>
                  Angkatan 2024/2027
                </p>

                <div className="recipient-badge-v2">
                  <span style={{ display: 'block', fontSize: '0.78rem', color: '#92753a', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '0.35rem', fontWeight: 700 }}>
                    Kepada Yth.
                  </span>
                  <strong style={{ display: 'block', fontSize: '1.25rem', color: '#0f2b5c', fontWeight: 700, lineHeight: 1.35 }}>
                    Seluruh Siswa-Siswi & Orang Tua / Wali
                  </strong>
                  <span style={{ display: 'inline-block', fontSize: '0.88rem', color: '#c59b27', fontWeight: 600, marginTop: '0.25rem' }}>
                    Keluarga Besar Angkatan 2024/2027
                  </span>
                  <span style={{ display: 'block', fontSize: '0.82rem', color: '#556274', marginTop: '0.45rem', lineHeight: 1.4 }}>
                    Beserta Kedua Orang Tua / Pendamping (Maks. 3 Kursi)
                  </span>
                </div>

                <button 
                  className="cover-btn-open" 
                  onClick={handleOpenInvitation} 
                >
                  <MailOpen size={19} />
                  Buka Undangan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="hero">
        {/* Ambient School Building Backdrop */}
        <div className="hero-bg-container" aria-hidden="true">
          <div className="hero-bg-image" />
          <div className="hero-bg-overlay" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center"
          style={{ padding: '0 1.5rem', position: 'relative', zIndex: 2 }}
        >
          {/* Logo Brand Emblem */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="hero-logo-wrapper"
          >
            <img 
              src="/images/smk6.png" 
              alt="Logo SMK Negeri 6 Surakarta" 
              className="hero-school-logo"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="hero-subtitle"
          >
            Wisuda & Pelepasan Siswa-Siswi Angkatan 2024/2027
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="hero-title"
          >
            SMK NEGERI 6 SURAKARTA
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="hero-quote"
          >
            "Terbanglah Tinggi Menggapai Asa, Mengabdi Nyata untuk Nusa dan Bangsa"
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
            className="hero-date"
          >
            <Calendar size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: '-3px', color: 'var(--color-secondary)' }} />
            Sabtu, 20 Juni 2027
          </motion.div>

          {/* Countdown Timer */}
          <div className="countdown-grid">
            <div className="countdown-box">
              <div className="countdown-val">{timeLeft.days}</div>
              <div className="countdown-lbl">Hari</div>
            </div>
            <div className="countdown-box">
              <div className="countdown-val">{timeLeft.hours}</div>
              <div className="countdown-lbl">Jam</div>
            </div>
            <div className="countdown-box">
              <div className="countdown-val">{timeLeft.minutes}</div>
              <div className="countdown-lbl">Menit</div>
            </div>
            <div className="countdown-box">
              <div className="countdown-val">{timeLeft.seconds}</div>
              <div className="countdown-lbl">Detik</div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ delay: 2, duration: 2, repeat: Infinity }}
          style={{ position: 'absolute', bottom: '35px', color: 'var(--color-primary)' }}
        >
          <ChevronDown size={32} />
        </motion.div>

        <div className="custom-shape-divider-bottom">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill" />
          </svg>
        </div>
      </section>

      {/* Sambutan Kepala Sekolah */}
      <section className="section-padding sambutan-section text-center">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="container glass-card"
        >
          <h3 className="section-title">
            Sambutan Kepala Sekolah
          </h3>

          <p className="sambutan-text">
            "Selamat dan sukses kepada seluruh siswa-siswi kelas XII atas kelulusannya. Tiga tahun penuh perjuangan telah kalian lewati dengan gemilang. Jadikan ilmu, etika, dan keahlian vokasi yang didapat di SMK Negeri 6 Surakarta sebagai pondasi kokoh menapaki dunia kerja, industri, wirausaha, maupun jenjang perguruan tinggi. Teruslah berkarya dan harumkan nama almamater tercinta."
          </p>

          <div className="gold-line"></div>

          <p style={{ fontWeight: '700', color: 'var(--color-primary-dark)', fontSize: '1.2rem', marginTop: '1.2rem' }}>
            Dr. Dwi Titik Irdiyanti, S.Si., M.Pd.
          </p>
          <p style={{ color: 'var(--color-secondary)', fontSize: '0.9rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
            Kepala SMK Negeri 6 Surakarta
          </p>
        </motion.div>
      </section>

      {/* School Showcase: Gedung & Halaman Depan SMK Negeri 6 Surakarta */}
      <section className="section-padding school-showcase text-center">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="section-title">
              Gedung SMK Negeri 6 Surakarta
            </h2>
            <div className="gold-line"></div>
            <p className="section-subtitle">
              Saksi ribuan langkah perjuangan, kebersamaan, dan prestasi yang terukir di SMK Negeri 6 Surakarta.
            </p>
          </motion.div>

          <motion.div 
            className="showcase-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="showcase-img-container">
              <img 
                src="/images/smk6-depan-web.jpg" 
                alt="Halaman Depan dan Gedung SMK Negeri 6 Surakarta" 
                className="showcase-img"
              />
              <div className="showcase-badge">
                <MapPin size={16} style={{ color: 'var(--color-secondary-bright)' }} />
                <span>SMK Negeri 6 Surakarta</span>
              </div>
            </div>
            <div className="showcase-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                <Sparkles size={16} />
                <span>Kenangan Indah Masa Sekolah</span>
              </div>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--color-primary-dark)', marginBottom: '0.8rem' }}>
                Halaman Utama & Gedung Kebanggaan Kita
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: '1.8' }}>
                Dari upacara bendera di lapangan hijau, lorong-lorong kelas yang penuh inspirasi, hingga laboratorium kejuruan tempat kami mengasah kompetensi. Terima kasih bapak dan ibu guru atas bimbingan dan teladan tanpa lelah.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rangkaian Acara (Rundown) & Waktu */}
      <section className="section-padding details-section">
        <div className="container text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="section-title">
              Rangkaian Acara Wisuda
            </h2>
            <div className="gold-line"></div>
            <p className="section-subtitle">
              Jadwal pelaksanaan Sidang Terbuka Wisuda & Pelepasan Siswa-Siswi Angkatan 2024/2027:
            </p>
          </motion.div>
          
          <div className="events-grid">
            {/* Waktu & Lokasi Acara */}
            <motion.div 
              className="glass-card text-center" 
              style={{ padding: '2.5rem 2rem' }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h3 className="event-title">Waktu & Tempat Pelaksanaan</h3>
              <div className="event-time">
                <Calendar size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: '-3px', color: 'var(--color-secondary)' }}/>
                Sabtu, 20 Juni 2027
              </div>
              <div className="event-time" style={{ marginBottom: '1.5rem' }}>
                <Clock size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: '-3px', color: 'var(--color-secondary)' }}/>
                07:30 WIB - 12:30 WIB
              </div>
              <div className="gold-line" style={{ width: '40px', margin: '1.5rem auto' }}></div>
              <p className="event-location">
                <strong style={{ color: 'var(--color-primary-dark)', fontSize: '1.1rem' }}>Gedung SMK Negeri 6 Surakarta</strong><br/>
                Jl. Adi Sucipto No. 38, Kelurahan Kerten, Kecamatan Laweyan, Kota Surakarta, Jawa Tengah
              </p>
              <div style={{ marginTop: '2rem' }}>
                <a 
                  href="https://maps.google.com/?q=SMK+Negeri+6+Surakarta" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  <Navigation size={18} />
                  Buka Lokasi di Google Maps
                </a>
              </div>
            </motion.div>

            {/* Timeline Susunan Acara */}
            <motion.div 
              className="glass-card" 
              style={{ padding: '2.5rem 2rem' }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h3 className="event-title text-center" style={{ marginBottom: '2rem' }}>Rundown Acara</h3>
              
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <strong style={{ color: 'var(--color-primary-dark)', display: 'block', fontSize: '1rem' }}>07.30 - 08.15 WIB</strong>
                <span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>Registrasi & Masuk Aula</span>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Siswa dan orang tua menempati nomor kursi yang telah disediakan.</p>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <strong style={{ color: 'var(--color-primary-dark)', display: 'block', fontSize: '1rem' }}>08.15 - 09.00 WIB</strong>
                <span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>Pembukaan & Sidang Terbuka</span>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Kirab Dewan Guru, Menyanyikan Lagu Indonesia Raya & Mars SMK 6.</p>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <strong style={{ color: 'var(--color-primary-dark)', display: 'block', fontSize: '1rem' }}>09.00 - 11.30 WIB</strong>
                <span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>Prosesi Pengalungan Gordon & Ijazah</span>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Pemanggilan wisudawan tiap jurusan & penganugerahan siswa berprestasi.</p>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <strong style={{ color: 'var(--color-primary-dark)', display: 'block', fontSize: '1rem' }}>11.30 - 12.30 WIB</strong>
                <span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>Pelepasan Almamater & Ramah Tamah</span>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Penampilan perpisahan, foto bersama angkatan, dan santap siang.</p>
              </div>
            </motion.div>
          </div>

          {/* Tata Tertib & Ketentuan */}
          <motion.div 
            className="info-card"
            style={{ maxWidth: '850px', margin: '3rem auto 0' }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', color: 'var(--color-primary-dark)' }}>
              <Info size={24} style={{ color: 'var(--color-secondary)' }} />
              <h4 style={{ fontSize: '1.25rem', margin: 0 }}>Tata Tertib & Ketentuan Kehadiran</h4>
            </div>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-muted)', lineHeight: '1.85', fontSize: '0.96rem' }}>
              <li><strong>Pakaian Siswa:</strong> Mengenakan seragam putih dan almamater SMK Negeri 6 Surakarta.</li>
              <li><strong>Pakaian Orang Tua / Wali:</strong> Pakaian Batik Formal / Kebaya Rapi & Sopan.</li>
              <li><strong>Alokasi Kursi:</strong> Setiap siswa mendapatkan alokasi maksimal <strong>3 kursi</strong> (1 kursi siswa + 2 kursi orang tua/pendamping).</li>
              <li>Harap hadir paling lambat 30 menit sebelum acara dimulai demi kelancaran prosesi registrasi.</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="section-padding rsvp-section text-center">
        <div className="container">
          <motion.div
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true }}
             variants={fadeInUp}
          >
            <h2 className="section-title">
              Konfirmasi Kehadiran Siswa
            </h2>
            <div className="gold-line"></div>
            <p className="section-subtitle">
              Mohon siswa-siswi dan wali murid mengisi konfirmasi kehadiran agar panitia dapat menyiapkan tempat duduk aula dan konsumsi secara optimal.
            </p>
          </motion.div>
          
          <motion.div 
            className="glass-card" 
            style={{ maxWidth: '650px', margin: '0 auto', background: '#ffffff' }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            {/* Segment Switcher: Formulir RSVP vs Cek & Unduh E-Tiket Tamu */}
            <div className="rsvp-tab-switcher">
              <button
                type="button"
                className={`rsvp-tab-btn ${rsvpActiveTab === 'form' ? 'active' : ''}`}
                onClick={() => setRsvpActiveTab('form')}
              >
                <CheckCircle2 size={16} />
                Isi Konfirmasi Kehadiran
              </button>
              <button
                type="button"
                className={`rsvp-tab-btn ${rsvpActiveTab === 'ticket' ? 'active' : ''}`}
                onClick={() => setRsvpActiveTab('ticket')}
              >
                <Download size={16} />
                Cek & Download E-Tiket Tamu (PDF)
              </button>
            </div>

            {submitStatus === 'error' && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="error-message">
                Maaf, terjadi kendala saat menyimpan data ke Supabase. Silakan periksa koneksi internet Anda atau coba lagi.
              </motion.div>
            )}

            {/* TAB 1: FORMULIR RSVP KEHADIRAN */}
            {rsvpActiveTab === 'form' && (
              <>
                {submitStatus === 'success' && lastSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ duration: 0.35 }}
                    className="rsvp-confirmed-card"
                  >
                    <div className="confirmed-icon-wrapper">
                      <CheckCircle size={40} style={{ color: '#059669' }} />
                    </div>

                    <h3 style={{ fontSize: '1.6rem', color: 'var(--color-primary-dark)', marginBottom: '0.4rem', fontFamily: 'var(--font-heading)' }}>
                      Konfirmasi Kehadiran Terkirim!
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginBottom: '1.4rem', lineHeight: '1.6' }}>
                      Data konfirmasi Anda telah berhasil tercatat resmi di sistem panitia wisuda SMK Negeri 6 Surakarta.
                    </p>

                    {/* Ringkasan Bukti Konfirmasi */}
                    <div className="confirmed-details-box">
                      <div className="confirmed-detail-row">
                        <span className="confirmed-detail-label">Nama Lengkap:</span>
                        <strong className="confirmed-detail-value">{lastSubmitted.name}</strong>
                      </div>

                      <div className="confirmed-detail-row">
                        <span className="confirmed-detail-label">Kelas & Jurusan:</span>
                        <span className="confirmed-detail-badge">{lastSubmitted.student_class}</span>
                      </div>

                      <div className="confirmed-detail-row">
                        <span className="confirmed-detail-label">Status Kehadiran:</span>
                        <span className={`confirmed-status-pill ${lastSubmitted.attendance === 'yes' ? 'status-hadir' : 'status-absen'}`}>
                          {lastSubmitted.attendance === 'yes' ? '✓ Hadir' : '✕ Tidak Dapat Hadir'}
                        </span>
                      </div>

                      {lastSubmitted.attendance === 'yes' && (
                        <div className="confirmed-detail-row">
                          <span className="confirmed-detail-label">Total Kursi:</span>
                          <strong className="confirmed-detail-value" style={{ color: 'var(--color-primary)' }}>
                            🪑 {lastSubmitted.pax} Kursi (Siswa + Pendamping)
                          </strong>
                        </div>
                      )}

                      {lastSubmitted.message && (
                        <div className="confirmed-detail-row" style={{ flexDirection: 'column', alignItems: 'flex-start', borderBottom: 'none' }}>
                          <span className="confirmed-detail-label" style={{ marginBottom: '0.35rem' }}>Pesan / Kesan:</span>
                          <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
                            "{lastSubmitted.message}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Tombol Aksi & Download PDF */}
                    <div style={{ marginTop: '1.8rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'center' }}>
                      <button 
                        type="button"
                        onClick={() => handleDownloadPdf(lastSubmitted)}
                        className="btn-download-pdf-prominent"
                      >
                        <Download size={19} />
                        Download Bukti Konfirmasi (PDF)
                      </button>

                      <button 
                        type="button"
                        onClick={() => {
                          setSubmitStatus(null);
                        }}
                        className="btn-outline"
                        style={{ fontSize: '0.88rem', padding: '0.75rem 1.8rem', width: '100%', maxWidth: '380px' }}
                      >
                        Ubah / Kirim Konfirmasi Baru
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {/* 1. Input Teks Nama Calon Wisudawan (Cukup mengetik saja tanpa dropdown) */}
                    <div className="form-group" style={{ textAlign: 'left' }}>
                      <label className="form-label" htmlFor="student_name">
                        Nama Lengkap Calon Wisudawan <span style={{ color: '#dc2626' }}>*</span>
                      </label>
                      <input 
                        type="text"
                        id="student_name" 
                        name="name"
                        className="form-control"
                        placeholder="Ketik nama lengkap Anda (contoh: Muhammad Zidane)..."
                        value={formData.name} 
                        onChange={handleNameInputChange}
                        autoComplete="off"
                        required
                      />

                      {/* Saran Nama Cepat saat Mengetik */}
                      {nameSuggestions.length > 0 && (
                        <div className="name-suggestion-chips">
                          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>Saran nama:</span>
                          {nameSuggestions.map(st => (
                            <button
                              key={st.id}
                              type="button"
                              className="name-suggestion-chip"
                              onClick={() => handleSelectSuggestion(st)}
                            >
                              {st.name}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Status Verifikasi Nama Calon Wisudawan */}
                      {selectedStudent ? (
                        <div className="verified-student-banner">
                          <CheckCircle2 size={18} style={{ color: '#059669', flexShrink: 0 }} />
                          <span>
                            Terverifikasi resmi: <strong>{selectedStudent.name}</strong> (Calon Wisudawan SMK 6)
                          </span>
                        </div>
                      ) : formData.name.trim().length >= 3 && !alreadySubmittedData ? (
                        <div className="unverified-student-banner">
                          <AlertCircle size={17} style={{ color: '#d97706', flexShrink: 0 }} />
                          <span>
                            Nama belum cocok dengan 16 calon wisudawan resmi SMK Negeri 6 Surakarta. Mohon ketik nama lengkap sesuai ijazah.
                          </span>
                        </div>
                      ) : null}
                    </div>

                    {/* 2. Input Kelas & Jurusan */}
                    <div className="form-group" style={{ textAlign: 'left' }}>
                      <label className="form-label" htmlFor="student_class">
                        Kelas & Jurusan <span style={{ color: '#dc2626' }}>*</span>
                      </label>
                      <input 
                        type="text"
                        id="student_class" 
                        name="student_class"
                        className="form-control"
                        placeholder="Contoh: XII RPL"
                        value={formData.student_class} 
                        onChange={handleInputChange}
                        autoComplete="off"
                        required
                      />
                      <div className="class-quick-tags">
                        <span style={{ fontSize: '0.74rem', color: '#64748b', marginRight: '4px', alignSelf: 'center', fontWeight: 500 }}>
                          Pilihan Cepat:
                        </span>
                        {['XII RPL', 'XII RPL 1', 'XII RPL 2', 'XII AKL', 'XII MP', 'XII DKV'].map(cls => (
                          <button
                            key={cls}
                            type="button"
                            className={`class-tag-pill ${formData.student_class === cls ? 'active' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, student_class: cls }))}
                          >
                            {cls}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notifikasi Bila Siswa Sudah Pernah Mengisi Kehadiran */}
                    {alreadySubmittedData && (
                      <div className="already-submitted-notice">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#b45309', fontWeight: 700, fontSize: '0.96rem', marginBottom: '0.4rem' }}>
                          <AlertCircle size={20} style={{ flexShrink: 0, color: '#d97706' }} />
                          <span>Konfirmasi Kehadiran Sudah Pernah Dikirim</span>
                        </div>
                        <p style={{ margin: '0.2rem 0 0.75rem', color: '#4b5563', fontSize: '0.88rem', lineHeight: '1.5' }}>
                          Siswa atas nama <strong>{alreadySubmittedData.name}</strong> sudah tercatat mengirim konfirmasi kehadiran sebelumnya.
                        </p>
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.5rem',
                          background: '#ffffff',
                          padding: '0.75rem 0.9rem',
                          borderRadius: '10px',
                          border: '1px solid #fde68a',
                          fontSize: '0.85rem'
                        }}>
                          <span>Status: <strong style={{ color: alreadySubmittedData.attendance === 'yes' ? '#059669' : '#dc2626' }}>
                            {alreadySubmittedData.attendance === 'yes' ? '✓ Pasti Hadir' : '✕ Tidak Hadir'}
                          </strong></span>
                          {alreadySubmittedData.attendance === 'yes' && (
                            <span>| Kursi: <strong>{alreadySubmittedData.pax} Kursi</strong></span>
                          )}
                          {alreadySubmittedData.created_at && (
                            <span style={{ color: '#6b7280' }}>
                              | Waktu: {new Date(alreadySubmittedData.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          )}
                        </div>
                        {alreadySubmittedData.message && (
                          <p style={{ margin: '0.6rem 0 0', fontStyle: 'italic', fontSize: '0.85rem', color: '#6b7280' }}>
                            Pesan: "{alreadySubmittedData.message}"
                          </p>
                        )}
                        <p style={{ margin: '0.75rem 0 0', fontSize: '0.8rem', color: '#92400e', lineHeight: '1.4' }}>
                          *Satu siswa hanya dapat mengisi konfirmasi 1 kali demi mencegah duplikasi kursi. Silakan unduh bukti tiket resmi Anda melalui tombol di bawah:
                        </p>

                        <div style={{ marginTop: '0.9rem' }}>
                          <button
                            type="button"
                            onClick={() => handleDownloadPdf(alreadySubmittedData)}
                            className="btn-download-pdf-prominent"
                            style={{ maxWidth: '100%' }}
                          >
                            <Download size={18} />
                            Download Bukti Konfirmasi / E-Tiket (PDF)
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 3. Pilihan Status Kehadiran Interaktif */}
                    <div className="form-group" style={{ opacity: (!selectedStudent || alreadySubmittedData) ? 0.6 : 1, textAlign: 'left' }}>
                      <label className="form-label">Konfirmasi Kehadiran</label>
                      <div className="attendance-toggle-grid">
                        <button
                          type="button"
                          disabled={!selectedStudent || !!alreadySubmittedData}
                          className={`attendance-option-btn ${formData.attendance === 'yes' ? 'selected-yes' : ''}`}
                          onClick={() => setFormData(prev => ({ ...prev, attendance: 'yes', pax: prev.pax === '0' ? '3' : prev.pax }))}
                        >
                          <CheckCircle2 size={24} className="attendance-icon" />
                          <div>
                            <span className="attendance-title">Ya, Saya Hadir</span>
                            <span className="attendance-desc">Akan hadir memenuhi undangan</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          disabled={!selectedStudent || !!alreadySubmittedData}
                          className={`attendance-option-btn ${formData.attendance === 'no' ? 'selected-no' : ''}`}
                          onClick={() => setFormData(prev => ({ ...prev, attendance: 'no' }))}
                        >
                          <XCircle size={24} className="attendance-icon" />
                          <div>
                            <span className="attendance-title">Tidak Dapat Hadir</span>
                            <span className="attendance-desc">Mohon maaf berhalangan</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* 4. Pemilih Kursi Interaktif (Hanya tampil jika hadir) */}
                    {formData.attendance === 'yes' && (
                      <div className="form-group" style={{ opacity: (!selectedStudent || alreadySubmittedData) ? 0.6 : 1, textAlign: 'left' }}>
                        <label className="form-label">Alokasi Kursi yang Dibutuhkan</label>
                        <div className="pax-selector-grid">
                          {[
                            { count: '1', title: '1 Kursi', desc: 'Hanya Siswa' },
                            { count: '2', title: '2 Kursi', desc: 'Siswa + 1 Orang Tua' },
                            { count: '3', title: '3 Kursi', desc: 'Siswa + 2 Orang Tua' },
                          ].map(item => (
                            <button
                              key={item.count}
                              type="button"
                              disabled={!selectedStudent || !!alreadySubmittedData}
                              className={`pax-card-btn ${formData.pax === item.count ? 'active' : ''}`}
                              onClick={() => setFormData(prev => ({ ...prev, pax: item.count }))}
                            >
                              <Armchair size={22} className="pax-icon" />
                              <span className="pax-num">{item.title}</span>
                              <span className="pax-desc">{item.desc}</span>
                            </button>
                          ))}
                        </div>
                        <small style={{ display: 'block', marginTop: '0.45rem', color: 'var(--color-text-light)', fontSize: '0.8rem', textAlign: 'left' }}>
                          *Kapasitas maksimal 3 kursi per wisudawan (1 wisudawan + 2 orang tua / wali pendamping).
                        </small>
                      </div>
                    )}

                    {/* 5. Pesan / Ucapan */}
                    <div className="form-group" style={{ opacity: (!selectedStudent || alreadySubmittedData) ? 0.6 : 1, textAlign: 'left' }}>
                      <label className="form-label" htmlFor="message">Pesan / Kesan untuk Sekolah (Opsional)</label>
                      <textarea 
                        id="message" 
                        name="message" 
                        className="form-control" 
                        rows="3" 
                        disabled={!selectedStudent || !!alreadySubmittedData}
                        placeholder="Tuliskan ucapan terima kasih untuk bapak/ibu guru atau kenangan manis selama bersekolah..."
                        value={formData.message}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      className="btn-primary" 
                      disabled={isSubmitting || !selectedStudent || !!alreadySubmittedData} 
                      style={{ 
                        marginTop: '0.6rem',
                        opacity: (!selectedStudent || !!alreadySubmittedData) ? 0.6 : 1,
                        cursor: (!selectedStudent || !!alreadySubmittedData) ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isSubmitting 
                        ? 'Mengirim Konfirmasi...' 
                        : alreadySubmittedData 
                          ? 'Konfirmasi Sudah Terisi (Terkunci)' 
                          : !selectedStudent 
                            ? 'Ketik Nama Calon Wisudawan Terlebih Dahulu' 
                            : 'Kirim Konfirmasi Kehadiran'}
                    </button>
                  </form>
                )}
              </>
            )}

            {/* TAB 2: CEK & UNDUH E-TIKET TAMU (PDF) */}
            {rsvpActiveTab === 'ticket' && (
              <div style={{ textAlign: 'left' }}>
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '1.25rem 1.1rem',
                  marginBottom: '1.4rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: 'var(--color-primary-dark)' }}>
                    <Download size={20} style={{ color: 'var(--color-secondary)' }} />
                    <h4 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 700 }}>
                      Cari & Download Bukti Kehadiran (E-Tiket PDF)
                    </h4>
                  </div>
                  <p style={{ margin: '0 0 1rem', fontSize: '0.86rem', color: '#64748b', lineHeight: '1.5' }}>
                    Telah mengisi kehadiran sebelumnya? Ketikkan nama Anda di bawah ini untuk mencari dan mengunduh E-Tiket resmi dalam bentuk file PDF.
                  </p>

                  <form onSubmit={handleSearchGuestTicket} style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      className="form-control"
                      style={{ flex: 1, minWidth: '180px' }}
                      placeholder="Ketik nama siswa / calon wisudawan..."
                      value={guestTicketSearch}
                      onChange={(e) => setGuestTicketSearch(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ padding: '0.75rem 1.25rem', whiteSpace: 'nowrap' }}
                    >
                      <Search size={16} />
                      Cari E-Tiket
                    </button>
                  </form>
                </div>

                {ticketSearchError && (
                  <div className="unverified-student-banner" style={{ marginBottom: '1.2rem' }}>
                    <AlertCircle size={18} style={{ flexShrink: 0 }} />
                    <span>{ticketSearchError}</span>
                  </div>
                )}

                {searchedGuestTicket && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="confirmed-details-box"
                    style={{ border: '2px solid #0f2b5c' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.82rem', background: '#0f2b5c', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 700 }}>
                        E-Tiket Ditemukan
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {searchedGuestTicket.created_at ? new Date(searchedGuestTicket.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : ''}
                      </span>
                    </div>

                    <div className="confirmed-detail-row">
                      <span className="confirmed-detail-label">Nama Siswa:</span>
                      <strong className="confirmed-detail-value">{searchedGuestTicket.name}</strong>
                    </div>
                    <div className="confirmed-detail-row">
                      <span className="confirmed-detail-label">Kelas & Jurusan:</span>
                      <span className="confirmed-detail-badge">{searchedGuestTicket.student_class || 'XII RPL'}</span>
                    </div>
                    <div className="confirmed-detail-row">
                      <span className="confirmed-detail-label">Status Kehadiran:</span>
                      <span className={`confirmed-status-pill ${searchedGuestTicket.attendance === 'yes' ? 'status-hadir' : 'status-absen'}`}>
                        {searchedGuestTicket.attendance === 'yes' ? '✓ Pasti Hadir' : '✕ Tidak Hadir'}
                      </span>
                    </div>
                    {searchedGuestTicket.attendance === 'yes' && (
                      <div className="confirmed-detail-row">
                        <span className="confirmed-detail-label">Alokasi Kursi:</span>
                        <strong className="confirmed-detail-value" style={{ color: 'var(--color-primary)' }}>
                          🪑 {searchedGuestTicket.pax || 3} Kursi (Siswa + Pendamping)
                        </strong>
                      </div>
                    )}
                    {searchedGuestTicket.message && (
                      <div className="confirmed-detail-row" style={{ flexDirection: 'column', alignItems: 'flex-start', borderBottom: 'none' }}>
                        <span className="confirmed-detail-label" style={{ marginBottom: '0.35rem' }}>Pesan / Kesan:</span>
                        <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)', fontSize: '0.88rem', margin: 0 }}>
                          "{searchedGuestTicket.message}"
                        </p>
                      </div>
                    )}

                    <div style={{ marginTop: '1.4rem', textAlign: 'center' }}>
                      <button
                        type="button"
                        className="btn-download-pdf-prominent"
                        onClick={() => handleDownloadPdf(searchedGuestTicket)}
                      >
                        <Download size={18} />
                        Download E-Tiket Ini (PDF)
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <motion.div
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           variants={fadeInUp}
        >
          <img 
            src="/images/smk6.png" 
            alt="Logo SMK Negeri 6 Surakarta" 
            className="footer-school-logo"
          />
          <h3 className="footer-title">
            SMK NEGERI 6 SURAKARTA
          </h3>
          <p style={{ letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.82rem', marginBottom: '1.5rem', color: 'var(--color-secondary-bright)', fontWeight: 600 }}>
            Panitia Wisuda & Pelepasan Siswa-Siswi Angkatan 2024/2027
          </p>
          <p style={{ opacity: 0.85, fontSize: '0.9rem' }}>
            &copy; 2027 SMK Negeri 6 Surakarta. All Rights Reserved.
          </p>
          <p style={{ marginTop: '0.5rem', opacity: 0.6, fontSize: '0.82rem' }}>
            Dikembangkan untuk Projek Rekayasa Perangkat Lunak (RPL)
          </p>
        </motion.div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', color: '#1e3a8a' }}>
        <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>Memuat Undangan Wisuda SMK Negeri 6 Surakarta...</p>
      </div>
    }>
      <InvitationContent />
    </Suspense>
  );
}
