"use client";
import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../supabaseClient';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  MapPin, 
  Award, 
  MailOpen, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  Users, 
  Info, 
  MessageSquare, 
  ChevronDown,
  Navigation,
  School,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Ornamen Sudut Emas Mewah (Filigree Corner)
function FiligreeCorner({ position }) {
  const isRight = position.includes('right');
  const isBottom = position.includes('bottom');
  
  return (
    <svg 
      viewBox="0 0 70 70" 
      fill="none" 
      style={{
        position: 'absolute',
        top: isBottom ? 'auto' : '10px',
        bottom: isBottom ? '10px' : 'auto',
        left: isRight ? 'auto' : '10px',
        right: isRight ? '10px' : 'auto',
        width: '44px',
        height: '44px',
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
  const searchParams = useSearchParams();
  const guestNameParam = useMemo(() => searchParams.get('to') || '', [searchParams]);
  const guestClassParam = useMemo(() => searchParams.get('kelas') || '', [searchParams]);

  // State Cover & Audio
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Form RSVP state
  const [formData, setFormData] = useState({
    name: guestNameParam,
    student_class: guestClassParam,
    attendance: 'yes',
    pax: '3',
    message: ''
  });

  // Sinkronisasi form jika parameter query berubah
  useEffect(() => {
    if (guestNameParam || guestClassParam) {
      setFormData(prev => ({
        ...prev,
        name: guestNameParam || prev.name,
        student_class: guestClassParam || prev.student_class
      }));
    }
  }, [guestNameParam, guestClassParam]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [guestMessages, setGuestMessages] = useState([]);

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

  // Fetch messages from Supabase
  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (!error && data) {
        setGuestMessages(data);
      }
    } catch {
      console.log('Error fetching messages from Supabase');
    }
  };

  useEffect(() => {
    let ignore = false;
    async function loadInitial() {
      try {
        const { data, error } = await supabase
          .from('rsvps')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);
        if (!ignore && !error && data) {
          setGuestMessages(data);
        }
      } catch {
        console.log('Could not load guest messages initially');
      }
    }
    loadInitial();
    return () => {
      ignore = true;
    };
  }, []);

  // Handle Cover Open
  const handleOpenInvitation = () => {
    setIsCoverOpen(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  // Toggle Music Play/Pause
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('Audio play failed:', err);
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const payload = {
      name: formData.name,
      student_class: formData.student_class || '-',
      attendance: formData.attendance,
      pax: formData.attendance === 'yes' ? parseInt(formData.pax, 10) : 0,
      message: formData.message
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
              name: `${formData.name} (${formData.student_class})`,
              attendance: formData.attendance,
              message: `[Jumlah: ${formData.attendance === 'yes' ? formData.pax : 0} Org] ${formData.message}`
            }]);
          if (fallbackError) throw fallbackError;
        } else {
          throw error;
        }
      }

      setSubmitStatus('success');
      setFormData(prev => ({ ...prev, message: '' }));
      fetchMessages();
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <div className="app-container">
      {/* Background Audio */}
      <audio 
        ref={audioRef} 
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=cinematic-time-lapse-115672.mp3" 
        loop 
        preload="auto"
      />

      {/* Floating Audio Button */}
      {isCoverOpen && (
        <motion.button 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`floating-music-btn ${isPlaying ? 'music-spinning' : ''}`}
          onClick={toggleAudio}
          title={isPlaying ? "Jeda Musik" : "Putar Musik"}
          aria-label="Musik Latar"
        >
          {isPlaying ? <Volume2 size={22} /> : <VolumeX size={22} />}
        </motion.button>
      )}

      {/* Gate Cover / Buka Undangan Modal */}
      <AnimatePresence>
        {!isCoverOpen && (
          <motion.div 
            className="cover-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -100, transition: { duration: 0.8, ease: "easeInOut" } }}
          >
            {/* Ambient Glow Orbs */}
            <div className="ambient-glow-orb orb-gold-cover" />
            <div className="ambient-glow-orb orb-blue-cover" />

            {/* Floating Golden Celebration Dust */}
            <div className="floating-particles-container">
              {[...Array(16)].map((_, i) => (
                <div 
                  key={i} 
                  className="gold-particle"
                  style={{
                    left: `${(i * 6.2 + 3) % 94}%`,
                    width: `${(i % 3) * 3 + 4}px`,
                    height: `${(i % 3) * 3 + 4}px`,
                    animationDuration: `${7 + (i % 5) * 2.5}s`,
                    animationDelay: `${(i * 0.6) % 5}s`
                  }}
                />
              ))}
            </div>

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
                
                <h2 className="cover-title-main" style={{ fontSize: '2.15rem', color: '#0f2b5c', lineHeight: 1.15, marginBottom: '0.35rem', fontFamily: 'var(--font-heading)' }}>
                  Wisuda & Pelepasan Siswa
                </h2>

                <p style={{ fontSize: '1.05rem', color: '#0f2b5c', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                  SMK NEGERI 6 SURAKARTA
                </p>

                <p style={{ fontSize: '0.86rem', color: '#64748b', marginBottom: '1.25rem', fontWeight: 500 }}>
                  Tahun Ajaran 2026/2027
                </p>

                <div className="recipient-badge-v2">
                  <span style={{ display: 'block', fontSize: '0.78rem', color: '#92753a', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '0.35rem', fontWeight: 700 }}>
                    Kepada Yth. Siswa/i:
                  </span>
                  <strong style={{ display: 'block', fontSize: '1.35rem', color: '#0f2b5c', fontWeight: 700, lineHeight: 1.3 }}>
                    {guestNameParam || 'Calon Wisudawan / Wisudawati'}
                  </strong>
                  {guestClassParam && (
                    <span style={{ display: 'inline-block', fontSize: '0.88rem', color: '#c59b27', fontWeight: 600, marginTop: '0.2rem' }}>
                      Kelas {guestClassParam}
                    </span>
                  )}
                  <span style={{ display: 'block', fontSize: '0.82rem', color: '#556274', marginTop: '0.4rem' }}>
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
        {/* Floating Ambient Gold Dust */}
        <div className="floating-particles-container">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="gold-particle"
              style={{
                left: `${(i * 8.5 + 4) % 94}%`,
                width: `${(i % 3) * 2 + 3}px`,
                height: `${(i % 3) * 2 + 3}px`,
                animationDuration: `${9 + (i % 4) * 2}s`,
                animationDelay: `${(i * 0.8) % 5}s`,
                opacity: 0.65
              }}
            />
          ))}
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
            Wisuda & Pelepasan Siswa-Siswi Angkatan Ke-24
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
          <div className="event-icon-wrapper" style={{ margin: '0 auto 1.5rem' }}>
            <Award className="event-icon" size={36} />
          </div>

          <p style={{ letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.85rem', color: 'var(--color-secondary)', fontWeight: 700, marginBottom: '0.5rem' }}>
            Pesan & Amanat Resmi
          </p>

          <h3 style={{ fontSize: '2.4rem', marginBottom: '1.2rem', color: 'var(--color-primary-dark)' }}>
            Sambutan Kepala Sekolah
          </h3>

          <p style={{ fontSize: '1.15rem', fontStyle: 'italic', marginBottom: '2rem', color: 'var(--color-text-muted)', lineHeight: '1.85', maxWidth: '750px', margin: '0 auto 2rem' }}>
            "Selamat dan sukses kepada seluruh siswa-siswi kelas XII atas kelulusannya. Tiga tahun penuh perjuangan telah kalian lewati dengan gemilang. Jadikan ilmu, etika, dan keahlian vokasi yang didapat di SMK Negeri 6 Surakarta sebagai pondasi kokoh menapaki dunia kerja, industri, wirausaha, maupun jenjang perguruan tinggi. Teruslah berkarya dan harumkan nama almamater tercinta."
          </p>

          <div className="gold-line"></div>

          <p style={{ fontWeight: '700', color: 'var(--color-primary-dark)', fontSize: '1.2rem', marginTop: '1.2rem' }}>
            Drs. Titik, M.Pd.
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
            <div className="event-icon-wrapper">
              <School className="event-icon" size={32} />
            </div>
            <h2 style={{ fontSize: '2.8rem', marginBottom: '0.8rem', color: 'var(--color-primary-dark)' }}>
              Gedung Almamater Tercinta
            </h2>
            <div className="gold-line"></div>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '3rem', fontSize: '1.1rem', maxWidth: '680px', margin: '0 auto 3rem' }}>
              Saksi ribuan langkah perjuangan, kebersamaan, dan prestasi yang terukir di kampus SMK Negeri 6 Surakarta.
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
                src="/images/smk6-depan.jpg" 
                alt="Halaman Depan dan Gedung SMK Negeri 6 Surakarta" 
                className="showcase-img"
              />
              <div className="showcase-badge">
                <MapPin size={16} style={{ color: 'var(--color-secondary-bright)' }} />
                <span>Kampus SMK Negeri 6 Surakarta</span>
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
            <div className="event-icon-wrapper">
              <GraduationCap className="event-icon" size={32} />
            </div>
            <h2 style={{ fontSize: '2.8rem', marginBottom: '0.8rem', color: 'var(--color-primary-dark)' }}>
              Rangkaian Acara Wisuda
            </h2>
            <div className="gold-line"></div>
            <p style={{ marginBottom: '3.5rem', color: 'var(--color-text-light)', fontSize: '1.1rem' }}>
              Jadwal pelaksanaan Sidang Terbuka Wisuda & Pelepasan Siswa-Siswi Angkatan 2026/2027:
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
              <div className="event-icon-wrapper">
                <MapPin className="event-icon" size={32} />
              </div>
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
                <strong style={{ color: 'var(--color-primary-dark)', fontSize: '1.1rem' }}>Grand Ballroom Graha Bhakti Husada</strong><br/>
                Jl. Pendidikan Utama No. 12, Kota Wisata, Surakarta
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
              <li><strong>Pakaian Siswa:</strong> Mengenakan setelan Toga lengkap dengan Gordon/Medali yang telah dibagikan.</li>
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
            <div className="event-icon-wrapper">
              <Users className="event-icon" size={32} />
            </div>
            <h2 style={{ fontSize: '2.8rem', marginBottom: '0.8rem', color: 'var(--color-primary-dark)' }}>
              Konfirmasi Kehadiran Siswa (RSVP)
            </h2>
            <div className="gold-line"></div>
            <p style={{ marginBottom: '3rem', color: 'var(--color-text-light)', fontSize: '1.1rem' }}>
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
            {submitStatus === 'success' && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="success-message">
                <CheckCircle size={28} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                Terima kasih! Konfirmasi kehadiran Anda telah berhasil tersimpan di sistem sekolah.
              </motion.div>
            )}
            
            {submitStatus === 'error' && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="error-message">
                Maaf, terjadi kendala saat menyimpan data ke Supabase. Pastikan aturan izin RLS (Row Level Security) pada tabel rsvps sudah diaktifkan.
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Nama Lengkap Siswa</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  className="form-control" 
                  placeholder="Contoh: Ahmad Fauzi"
                  value={formData.name}
                  onChange={handleInputChange}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="student_class">Kelas & Jurusan</label>
                <input 
                  type="text" 
                  id="student_class" 
                  name="student_class" 
                  className="form-control" 
                  placeholder="Contoh: XII RPL 1 / XII AKL 2 / XII OTKP 1"
                  value={formData.student_class}
                  onChange={handleInputChange}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="attendance">Konfirmasi Kehadiran</label>
                <select 
                  id="attendance" 
                  name="attendance" 
                  className="form-control" 
                  value={formData.attendance}
                  onChange={handleInputChange}
                  required
                >
                  <option value="yes">Ya, Saya & Orang Tua Hadir</option>
                  <option value="no">Maaf, Tidak Dapat Hadir</option>
                </select>
              </div>

              {formData.attendance === 'yes' && (
                <div className="form-group">
                  <label className="form-label" htmlFor="pax">Total Kursi yang Dibutuhkan</label>
                  <select 
                    id="pax" 
                    name="pax" 
                    className="form-control" 
                    value={formData.pax}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="1">1 Kursi (Hanya Siswa)</option>
                    <option value="2">2 Kursi (Siswa + 1 Orang Tua / Pendamping)</option>
                    <option value="3">3 Kursi (Siswa + 2 Orang Tua / Pendamping)</option>
                  </select>
                  <small style={{ display: 'block', marginTop: '0.4rem', color: 'var(--color-text-light)', fontSize: '0.82rem', textAlign: 'left' }}>
                    *Alokasi kursi dibatasi maksimal 3 kursi per siswa (1 kursi siswa + 2 kursi orang tua/pendamping).
                  </small>
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="message">Pesan, Kesan, atau Ucapan Terima Kasih (Opsional)</label>
                <textarea 
                  id="message" 
                  name="message" 
                  className="form-control" 
                  rows="4" 
                  placeholder="Tuliskan ucapan terima kasih untuk bapak/ibu guru atau kenangan manis selama bersekolah..."
                  value={formData.message}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Mengirim Konfirmasi...' : 'Kirim Konfirmasi Kehadiran'}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Guestbook Section / Dinding Pesan Alumni */}
      <section className="section-padding guestbook-section">
        <div className="container text-center">
          <motion.div
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true }}
             variants={fadeInUp}
          >
            <div className="event-icon-wrapper">
              <MessageSquare className="event-icon" size={32} />
            </div>
            <h2 style={{ fontSize: '2.8rem', marginBottom: '0.8rem', color: 'var(--color-primary-dark)' }}>
              Dinding Kesan & Pesan Wisudawan
            </h2>
            <div className="gold-line"></div>
            <p style={{ marginBottom: '2rem', color: 'var(--color-text-light)' }}>
              Untaian kata dan kenangan manis dari teman-teman angkatan 2026/2027:
            </p>
          </motion.div>
          
          <motion.div 
            style={{ maxWidth: '780px', margin: '2rem auto 0', maxHeight: '520px', overflowY: 'auto', padding: '0.5rem' }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {guestMessages.length === 0 ? (
              <p style={{ color: 'var(--color-text-light)', fontStyle: 'italic', fontSize: '1.05rem', padding: '2rem' }}>
                Belum ada pesan. Jadilah yang pertama mengisi konfirmasi dan kesan pesan!
              </p>
            ) : (
              guestMessages.map((msg, index) => (
                <motion.div 
                  key={msg.id || index}
                  variants={fadeInUp}
                  className="message-card"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <strong style={{ color: 'var(--color-primary-dark)', fontSize: '1.15rem', marginRight: '0.5rem', fontWeight: 700 }}>
                        {msg.name}
                      </strong>
                      {msg.student_class && (
                        <span style={{
                          fontSize: '0.78rem', 
                          background: 'var(--color-primary-subtle)', 
                          color: 'var(--color-primary)',
                          padding: '0.2rem 0.65rem',
                          borderRadius: '12px',
                          border: '1px solid rgba(30, 58, 138, 0.18)',
                          fontWeight: 600
                        }}>
                          {msg.student_class}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {msg.attendance === 'yes' && msg.pax && (
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-light)', fontWeight: 500 }}>
                          👥 {msg.pax} Orang
                        </span>
                      )}
                      <span style={{
                        fontSize: '0.75rem', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '20px', 
                        backgroundColor: msg.attendance === 'yes' ? '#ecfdf5' : '#fef2f2',
                        color: msg.attendance === 'yes' ? '#047857' : '#b91c1c',
                        border: msg.attendance === 'yes' ? '1px solid #a7f3d0' : '1px solid #fecaca',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        fontWeight: 600
                      }}>
                        {msg.attendance === 'yes' ? 'Hadir' : 'Tidak Hadir'}
                      </span>
                    </div>
                  </div>
                  <p style={{ color: 'var(--color-text-muted)', fontStyle: msg.message ? 'normal' : 'italic', opacity: msg.message ? 1 : 0.6, lineHeight: '1.65', fontSize: '0.98rem' }}>
                    {msg.message || "Tanpa pesan tertulis."}
                  </p>
                </motion.div>
              ))
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
          <h3 style={{ fontSize: '1.7rem', marginBottom: '0.4rem', color: '#ffffff' }}>
            SMK NEGERI 6 SURAKARTA
          </h3>
          <p style={{ letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.82rem', marginBottom: '1.5rem', color: 'var(--color-secondary-bright)', fontWeight: 600 }}>
            Panitia Wisuda & Pelepasan Siswa-Siswi Angkatan Ke-24
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
