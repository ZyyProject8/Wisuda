"use client";
import React, { useState, useEffect, useRef, Suspense } from 'react';
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
  Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function InvitationContent() {
  const searchParams = useSearchParams();
  const guestNameParam = searchParams.get('to');
  const guestClassParam = searchParams.get('kelas');

  // State Cover & Audio
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Form RSVP state
  const [formData, setFormData] = useState({
    name: guestNameParam || '',
    student_class: guestClassParam || '',
    attendance: 'yes',
    pax: '2',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [guestMessages, setGuestMessages] = useState([]);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Target Tanggal Wisuda: 20 Juni 2026 08:00 WIB
  useEffect(() => {
    const targetDate = new Date('2026-06-20T08:00:00+07:00').getTime();

    const interval = setInterval(() => {
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
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Update form if URL params change
  useEffect(() => {
    if (guestNameParam) {
      setFormData(prev => ({ ...prev, name: guestNameParam }));
    }
    if (guestClassParam) {
      setFormData(prev => ({ ...prev, student_class: guestClassParam }));
    }
  }, [guestNameParam, guestClassParam]);

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
    fetchMessages();
  }, []);

  // Handle Cover Open
  const handleOpenInvitation = () => {
    setIsCoverOpen(true);
    // Play background music
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
        // Fallback jika database belum ada kolom student_class / pax
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
      transition: { staggerChildren: 0.2 }
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
            <motion.div 
              className="cover-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="event-icon-wrapper" style={{margin: '0 auto 1.5rem'}}>
                <GraduationCap className="event-icon" size={36} />
              </div>
              <p style={{letterSpacing: '0.25em', textTransform: 'uppercase', fontSize: '0.85rem', color: 'var(--color-accent)', marginBottom: '0.5rem'}}>
                Undangan Resmi
              </p>
              <h2 style={{fontSize: '2.4rem', color: 'var(--color-secondary)', lineHeight: 1.2, marginBottom: '0.5rem'}}>
                Wisuda & Pelepasan Siswa
              </h2>
              <p style={{fontSize: '1.1rem', color: '#fff', fontWeight: 600, letterSpacing: '0.1em'}}>
                SMK NEGERI 1
              </p>
              <p style={{fontSize: '0.85rem', color: 'var(--color-text-light)', marginBottom: '1.5rem'}}>
                Tahun Ajaran 2025/2026
              </p>

              <div className="recipient-badge">
                <span style={{display: 'block', fontSize: '0.8rem', color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.4rem'}}>
                  Kepada Yth. Siswa/i:
                </span>
                <strong style={{display: 'block', fontSize: '1.4rem', color: 'var(--color-secondary)'}}>
                  {guestNameParam || 'Calon Wisudawan / Wisudawati'}
                </strong>
                {guestClassParam && (
                  <span style={{display: 'inline-block', fontSize: '0.9rem', color: 'var(--color-accent)', marginTop: '0.2rem'}}>
                    Kelas {guestClassParam}
                  </span>
                )}
                <span style={{display: 'block', fontSize: '0.85rem', color: 'var(--color-text-light)', marginTop: '0.4rem'}}>
                  Beserta 1 Orang Tua / Pendamping (Maks. 2 Kursi)
                </span>
              </div>

              <button className="btn-primary" onClick={handleOpenInvitation} style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem'}}>
                <MailOpen size={20} />
                Buka Undangan
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="hero">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center"
          style={{padding: '0 1.5rem'}}
        >
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="hero-subtitle"
          >
            Wisuda & Pelepasan Siswa-Siswi Angkatan Ke-28
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="hero-title"
          >
            SMK NEGERI 1
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            style={{fontSize: '1.15rem', color: 'var(--color-accent)', fontStyle: 'italic', marginBottom: '1.5rem'}}
          >
            "Terbanglah Tinggi Menggapai Asa, Mengabdi Nyata untuk Nusa dan Bangsa"
          </motion.p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 1 }}
            className="hero-date"
          >
            Sabtu, 20 Juni 2026
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
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 2, duration: 2, repeat: Infinity }}
          style={{ position: 'absolute', bottom: '40px', color: 'var(--color-accent)' }}
        >
          <ChevronDown size={32} />
        </motion.div>

        <div className="custom-shape-divider-bottom">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
            </svg>
        </div>
      </section>

      {/* Sambutan Kepala Sekolah */}
      <section className="section-padding text-center">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInUp}
          className="container glass-card"
        >
          <Award className="event-icon mx-auto" size={40} style={{margin: '0 auto 1.5rem', display: 'block'}} />
          <h3 style={{fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-secondary)'}}>
            Pesan & Sambutan Kepala Sekolah
          </h3>
          <p style={{fontSize: '1.15rem', fontStyle: 'italic', marginBottom: '2rem', color: 'var(--color-accent)', lineHeight: '1.8'}}>
            "Selamat dan sukses kepada seluruh siswa-siswi kelas XII atas kelulusannya. Tiga tahun penuh perjuangan telah kalian lewati dengan gemilang. Jadikan ilmu dan karakter yang didapat di sekolah ini sebagai bekal menapaki dunia kerja, wirausaha, maupun perguruan tinggi. Teruslah berkarya dan harumkan almamater."
          </p>
          <div className="gold-line"></div>
          <p style={{fontWeight: 'bold', color: '#fff', fontSize: '1.1rem'}}>Drs. H. Sulaiman, M.Pd.</p>
          <p style={{color: 'var(--color-text-light)', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase'}}>Kepala SMK Negeri 1</p>
        </motion.div>
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
            <h2 style={{fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-secondary)'}}>Rangkaian Acara</h2>
            <div className="gold-line"></div>
            <p style={{marginBottom: '3.5rem', color: 'var(--color-text-light)', fontSize: '1.1rem'}}>
              Jadwal pelaksanaan Sidang Terbuka Wisuda & Pelepasan Siswa-Siswi Angkatan 2026:
            </p>
          </motion.div>
          
          <div className="events-grid">
            {/* Waktu & Lokasi Acara */}
            <motion.div 
              className="glass-card text-center" 
              style={{padding: '2.5rem 2rem'}}
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
                <Calendar size={18} style={{display: 'inline', marginRight: '8px', verticalAlign: '-3px', color: 'var(--color-secondary)'}}/>
                Sabtu, 20 Juni 2026
              </div>
              <div className="event-time" style={{marginBottom: '1.5rem'}}>
                <Clock size={18} style={{display: 'inline', marginRight: '8px', verticalAlign: '-3px', color: 'var(--color-secondary)'}}/>
                07:30 WIB - 12:30 WIB
              </div>
              <div className="gold-line" style={{width: '30px', margin: '1.5rem auto'}}></div>
              <p className="event-location">
                <strong>Grand Ballroom Graha Bhakti Husada</strong><br/>
                Jl. Pendidikan Utama No. 12, Kota Wisata, Jakarta
              </p>
              <div style={{marginTop: '2rem'}}>
                <a 
                  href="https://maps.google.com/?q=Grand+Ballroom" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  <Navigation size={18} />
                  Buka di Google Maps
                </a>
              </div>
            </motion.div>

            {/* Timeline Susunan Acara */}
            <motion.div 
              className="glass-card" 
              style={{padding: '2.5rem 2rem'}}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h3 className="event-title text-center" style={{marginBottom: '2rem'}}>Rundown Acara</h3>
              
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <strong style={{color: 'var(--color-secondary)', display: 'block'}}>07.30 - 08.15 WIB</strong>
                <span style={{color: '#fff', fontWeight: 500}}>Registrasi & Masuk Aula</span>
                <p style={{fontSize: '0.85rem', color: 'var(--color-text-light)'}}>Siswa dan orang tua menempati nomor kursi yang telah disediakan.</p>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <strong style={{color: 'var(--color-secondary)', display: 'block'}}>08.15 - 09.00 WIB</strong>
                <span style={{color: '#fff', fontWeight: 500}}>Pembukaan & Sidang Terbuka</span>
                <p style={{fontSize: '0.85rem', color: 'var(--color-text-light)'}}>Kirab Dewan Guru, Menyanyikan Lagu Indonesia Raya & Mars Sekolah.</p>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <strong style={{color: 'var(--color-secondary)', display: 'block'}}>09.00 - 11.30 WIB</strong>
                <span style={{color: '#fff', fontWeight: 500}}>Prosesi Pengalungan Gordon & Ijazah</span>
                <p style={{fontSize: '0.85rem', color: 'var(--color-text-light)'}}>Pemanggilan nama wisudawan tiap jurusan & penghargaan siswa teladan.</p>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <strong style={{color: 'var(--color-secondary)', display: 'block'}}>11.30 - 12.30 WIB</strong>
                <span style={{color: '#fff', fontWeight: 500}}>Pelepasan Almamater & Ramah Tamah</span>
                <p style={{fontSize: '0.85rem', color: 'var(--color-text-light)'}}>Penampilan perpisahan, foto bersama angkatan, dan santap siang.</p>
              </div>
            </motion.div>
          </div>

          {/* Tata Tertib & Ketentuan */}
          <motion.div 
            className="info-card"
            style={{maxWidth: '850px', margin: '2.5rem auto 0'}}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', color: 'var(--color-secondary)'}}>
              <Info size={24} />
              <h4 style={{fontSize: '1.2rem', margin: 0}}>Tata Tertib & Ketentuan Kehadiran</h4>
            </div>
            <ul style={{paddingLeft: '1.5rem', color: 'var(--color-text-light)', lineHeight: '1.8', fontSize: '0.95rem'}}>
              <li><strong>Pakaian Siswa:</strong> Mengenakan setelan Toga lengkap dengan Gordon/Medali yang telah dibagikan.</li>
              <li><strong>Pakaian Orang Tua / Wali:</strong> Pakaian Batik Formal / Pakaian Adat / Kebaya Rapi & Sopan.</li>
              <li><strong>Alokasi Kursi:</strong> Setiap siswa mendapatkan alokasi maksimal <strong>2 kursi</strong> (1 kursi siswa + 1 kursi orang tua/pendamping).</li>
              <li>Harap hadir 30 menit sebelum acara dimulai demi kelancaran prosesi registrasi.</li>
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
            <h2 style={{fontSize: '3rem', marginBottom: '1rem'}}>Konfirmasi Kehadiran Siswa (RSVP)</h2>
            <div className="gold-line"></div>
            <p style={{marginBottom: '3rem', color: 'var(--color-text-light)', fontSize: '1.1rem'}}>
              Mohon siswa-siswi dan wali murid melakukan konfirmasi kehadiran agar panitia dapat menyiapkan kursi aula dan konsumsi dengan baik.
            </p>
          </motion.div>
          
          <motion.div 
            className="glass-card" 
            style={{maxWidth: '650px', margin: '0 auto', background: 'rgba(255,255,255,0.02)'}}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            {submitStatus === 'success' && (
              <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="success-message">
                <CheckCircle size={28} style={{margin: '0 auto 0.5rem', display: 'block'}} />
                Terima kasih! Konfirmasi kehadiran Anda telah berhasil tersimpan di sistem sekolah.
              </motion.div>
            )}
            
            {submitStatus === 'error' && (
              <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="error-message">
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
                  placeholder="Contoh: XII RPL 1 / XII TKJ 2"
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
                  </select>
                  <small style={{display: 'block', marginTop: '0.4rem', color: 'var(--color-text-light)', fontSize: '0.8rem', textAlign: 'left'}}>
                    *Alokasi kursi dibatasi maksimal 2 kursi per siswa demi keterbatasan kapasitas aula.
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
                  placeholder="Tuliskan ucapan terima kasih untuk bapak/ibu guru atau kenangan selama di sekolah..."
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
            <h2 style={{fontSize: '3rem', marginBottom: '1rem'}}>Dinding Kesan & Pesan Wisudawan</h2>
            <div className="gold-line"></div>
            <p style={{marginBottom: '2rem', color: 'var(--color-text-light)'}}>
              Untaian kata dan kenangan manis dari teman-teman angkatan 2026:
            </p>
          </motion.div>
          
          <motion.div 
            style={{maxWidth: '750px', margin: '2rem auto 0', maxHeight: '500px', overflowY: 'auto', padding: '1rem'}}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {guestMessages.length === 0 ? (
              <p style={{color: 'var(--color-text-light)', fontStyle: 'italic', fontSize: '1.1rem'}}>
                Belum ada pesan. Jadilah yang pertama mengisi konfirmasi dan kesan pesan!
              </p>
            ) : (
              guestMessages.map((msg, index) => (
                <motion.div 
                  key={msg.id || index}
                  variants={fadeInUp}
                  className="message-card"
                >
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem'}}>
                    <div>
                      <strong style={{color: 'var(--color-accent)', fontSize: '1.15rem', marginRight: '0.5rem'}}>{msg.name}</strong>
                      {msg.student_class && (
                        <span style={{
                          fontSize: '0.75rem', 
                          background: 'rgba(197, 168, 128, 0.15)', 
                          color: 'var(--color-secondary)',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '12px',
                          border: '1px solid rgba(197, 168, 128, 0.3)'
                        }}>
                          {msg.student_class}
                        </span>
                      )}
                    </div>
                    <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                      {msg.attendance === 'yes' && msg.pax && (
                        <span style={{fontSize: '0.75rem', color: 'var(--color-text-light)', opacity: 0.8}}>
                          👥 {msg.pax} Orang
                        </span>
                      )}
                      <span style={{
                        fontSize: '0.75rem', 
                        padding: '0.2rem 0.7rem', 
                        borderRadius: '20px', 
                        backgroundColor: msg.attendance === 'yes' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                        color: msg.attendance === 'yes' ? '#4ade80' : '#f87171',
                        border: msg.attendance === 'yes' ? '1px solid rgba(46,204,113,0.3)' : '1px solid rgba(231,76,60,0.3)',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase'
                      }}>
                        {msg.attendance === 'yes' ? 'Hadir' : 'Tidak Hadir'}
                      </span>
                    </div>
                  </div>
                  <p style={{color: 'var(--color-text)', fontStyle: msg.message ? 'normal' : 'italic', opacity: msg.message ? 0.9 : 0.5, lineHeight: '1.6', fontSize: '0.95rem'}}>
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
          <GraduationCap className="event-icon mx-auto" size={32} style={{marginBottom: '1rem'}} />
          <h3 style={{fontSize: '1.6rem', marginBottom: '0.5rem', color: 'var(--color-secondary)'}}>SMK NEGERI 1</h3>
          <p style={{letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: '1.5rem', color: 'var(--color-text-light)'}}>
            Panitia Wisuda & Pelepasan Siswa Angkatan 2026
          </p>
          <p>&copy; 2026 SMK Negeri 1. All Rights Reserved.</p>
          <p style={{marginTop: '0.5rem', opacity: 0.5, fontSize: '0.8rem'}}>Dikembangkan untuk Projek Rekayasa Perangkat Lunak (RPL)</p>
        </motion.div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f0f1a', color: '#c5a880'}}>
        <p>Memuat Undangan Wisuda...</p>
      </div>
    }>
      <InvitationContent />
    </Suspense>
  );
}
