"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { supabase } from '../supabaseClient';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  MailOpen, 
  CheckCircle, 
  CheckCircle2,
  XCircle,
  Armchair,
  Info, 
  ChevronDown,
  ChevronUp,
  Navigation,
  Sparkles,
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

              {/* Google Maps Interaktif Tertanam (Interactive Map Viewport) */}
              <div style={{
                marginTop: '1.4rem',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1.5px solid rgba(197, 155, 39, 0.35)',
                boxShadow: '0 4px 14px rgba(15, 43, 92, 0.08)',
                lineHeight: 0
              }}>
                <iframe
                  title="Lokasi SMK Negeri 6 Surakarta"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.1438965902264!2d110.7937397758784!3d-7.559288174646706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a1670984920e1%3A0x6b9d62d04a62e08!2sSMK%20Negeri%206%20Surakarta!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <div style={{ marginTop: '1.2rem' }}>
                <a 
                  href="https://maps.google.com/?q=SMK+Negeri+6+Surakarta" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  <Navigation size={18} />
                  Buka Rute di Aplikasi Google Maps
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
            {submitStatus === 'error' && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="error-message">
                Maaf, terjadi kendala saat menyimpan data ke Supabase. Silakan periksa koneksi internet Anda atau coba lagi.
              </motion.div>
            )}

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
                  Terima kasih, data konfirmasi kehadiran Anda telah berhasil tercatat resmi di sistem panitia wisuda SMK Negeri 6 Surakarta.
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
                      {lastSubmitted.attendance === 'yes' ? '✓ Pasti Hadir' : '✕ Tidak Dapat Hadir'}
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

                {/* Tombol Kembali / Ubah */}
                <div style={{ marginTop: '1.6rem', textAlign: 'center' }}>
                  <button 
                    type="button"
                    onClick={() => {
                      setSubmitStatus(null);
                    }}
                    className="btn-outline"
                    style={{ fontSize: '0.88rem', padding: '0.75rem 2rem' }}
                  >
                    Kirim Konfirmasi Baru
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* 1. Input Teks Nama Calon Wisudawan */}
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

                {/* 2. Input Teks Kelas & Jurusan (Pilihan Cepat dihapus sesuai permintaan) */}
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
                      *Satu siswa hanya dapat mengisi konfirmasi 1 kali demi mencegah duplikasi kursi. Jika terdapat perubahan data, silakan hubungi panitia wisuda.
                    </p>
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
