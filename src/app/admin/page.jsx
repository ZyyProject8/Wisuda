"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { getMasterStudents, saveMasterStudents, SCHOOL_CLASSES } from '../../data/studentsData';
import {
  Users,
  CheckCircle,
  XCircle,
  Copy,
  Check,
  Search,
  Trash2,
  Armchair,
  Eye,
  EyeOff,
  UserPlus,
  RefreshCw,
  GraduationCap,
  RotateCcw,
  Share2,
  FileText,
  AlertCircle,
  Download,
  Edit2,
  X
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Tab Navigasi Admin: 'rsvp' | 'students'
  const [activeTab, setActiveTab] = useState('rsvp');

  // Master Data Siswa
  const [masterStudents, setMasterStudents] = useState([]);
  const [filterClass, setFilterClass] = useState('ALL');
  const [studentSearch, setStudentSearch] = useState('');

  // Form Tambah Siswa Baru
  const [newStudent, setNewStudent] = useState({
    name: '',
    student_class: SCHOOL_CLASSES[0] || 'XII RPL 1'
  });
  const [addSuccessMsg, setAddSuccessMsg] = useState('');

  // State Edit Data Siswa Master
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', student_class: '' });

  // State untuk Berbagi Link Broadcast
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedWA, setCopiedWA] = useState(false);

  // Password admin
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'wisuda24';

  // Muat data master siswa saat komponen aktif
  useEffect(() => {
    const students = getMasterStudents();
    setMasterStudents(students);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setLoginError(false);
      setIsAuthenticated(true);
      fetchData();
    } else {
      setLoginError(true);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setRsvps(data);
        try {
          localStorage.setItem('smk6_rsvps_cache', JSON.stringify(data));
        } catch {}
      } else {
        // Fallback ke cache lokal
        try {
          const cached = localStorage.getItem('smk6_rsvps_cache');
          if (cached) setRsvps(JSON.parse(cached));
        } catch {}
      }
    } catch {
      console.error('Error fetching data from Supabase');
      try {
        const cached = localStorage.getItem('smk6_rsvps_cache');
        if (cached) setRsvps(JSON.parse(cached));
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  // Hapus data konfirmasi kehadiran (RSVP)
  const handleDeleteRsvp = async (id, studentName) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus konfirmasi kehadiran untuk "${studentName || 'siswa ini'}"?`)) return;
    try {
      const { error } = await supabase
        .from('rsvps')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('Supabase delete error, updating locally:', error);
      }

      const updated = rsvps.filter(item => item.id !== id);
      setRsvps(updated);
      try {
        localStorage.setItem('smk6_rsvps_cache', JSON.stringify(updated));
      } catch {}
    } catch (err) {
      alert('Gagal menghapus data: ' + err.message);
    }
  };

  // Reset konfirmasi kehadiran siswa dari daftar master (agar siswa bisa mengisi ulang jika salah data)
  const handleResetStudentConfirmation = async (student) => {
    const matchingRsvp = rsvps.find(r => 
      r.name?.toLowerCase().trim() === student.name.toLowerCase().trim()
    );

    if (!matchingRsvp) {
      alert(`Siswa ${student.name} belum pernah mengirim konfirmasi kehadiran.`);
      return;
    }

    if (!confirm(`Reset konfirmasi kehadiran untuk ${student.name} (${student.student_class})?\n\nSetelah direset, siswa ini dapat mengisi formulir kehadiran kembali di website.`)) {
      return;
    }

    try {
      await supabase.from('rsvps').delete().eq('id', matchingRsvp.id);
    } catch (err) {
      console.warn('Supabase delete error:', err);
    }

    const updated = rsvps.filter(r => r.id !== matchingRsvp.id);
    setRsvps(updated);
    try {
      localStorage.setItem('smk6_rsvps_cache', JSON.stringify(updated));
    } catch {}
    alert(`Konfirmasi untuk ${student.name} berhasil direset. Siswa sekarang dapat mengisi kembali.`);
  };


  // Download PDF Resmi Khusus Daftar Tamu yang Akan Hadir (Tanpa dialog cetak)
  const handleDownloadAttendingPdf = (guestList) => {
    const listToDownload = (guestList || []).filter(g => g.attendance === 'yes');

    if (!listToDownload || listToDownload.length === 0) {
      alert('Belum ada data tamu yang mengonfirmasi hadir untuk diunduh.');
      return;
    }

    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();

      // Header Banner Atas (Biru Navy SMK6)
      doc.setFillColor(15, 43, 92);
      doc.rect(0, 0, pageWidth, 28, 'F');

      // Garis Aksen Emas
      doc.setFillColor(197, 155, 39);
      doc.rect(0, 28, pageWidth, 1.5, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('SMK NEGERI 6 SURAKARTA', pageWidth / 2, 11, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.text('Panitia Sidang Terbuka Wisuda & Pelepasan Siswa Angkatan 2024/2027', pageWidth / 2, 17, { align: 'center' });
      doc.setFontSize(8);
      doc.setTextColor(218, 225, 233);
      doc.text('Jl. Adi Sucipto No. 38, Kelurahan Kerten, Kecamatan Laweyan, Kota Surakarta, Jawa Tengah', pageWidth / 2, 23, { align: 'center' });

      // Judul Dokumen
      doc.setTextColor(15, 43, 92);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('DAFTAR RESMI TAMU & WISUDAWAN YANG AKAN HADIR', 14, 38);

      const totalSiswaHadir = listToDownload.length;
      const totalKursi = listToDownload.reduce((acc, g) => acc + (parseInt(g.pax, 10) || 1), 0);
      const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text(`Waktu Unduh: ${dateStr}   |   Total Tamu Hadir: ${totalSiswaHadir} Siswa   |   Total Kebutuhan Kursi: ${totalKursi} Kursi (Siswa + Orang Tua)`, 14, 44);

      // Tabel Data Tamu Hadir
      const tableData = listToDownload.map((g, idx) => [
        idx + 1,
        g.name || '-',
        g.student_class || '-',
        'Pasti Hadir',
        `${g.pax || 1} Kursi`,
        g.message ? (g.message.length > 55 ? g.message.substring(0, 52) + '...' : g.message) : '-',
        g.created_at ? new Date(g.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'
      ]);

      autoTable(doc, {
        startY: 48,
        head: [['No', 'Nama Wisudawan / Tamu', 'Kelas', 'Status Kehadiran', 'Alokasi Kursi', 'Pesan / Doa', 'Tanggal RSVP']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [15, 43, 92],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9,
          halign: 'center'
        },
        styles: {
          fontSize: 8.5,
          cellPadding: 3,
          textColor: [15, 23, 42]
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 12 },
          1: { fontStyle: 'bold', textColor: [15, 43, 92] },
          2: { halign: 'center', cellWidth: 26 },
          3: { halign: 'center', textColor: [5, 150, 105], fontStyle: 'bold', cellWidth: 32 },
          4: { halign: 'center', fontStyle: 'bold', cellWidth: 28 },
          5: { cellWidth: 'auto' },
          6: { halign: 'center', cellWidth: 28 }
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        }
      });

      const finalY = (doc.lastAutoTable?.finalY || 160) + 12;
      if (finalY < 185) {
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        doc.text('Mengetahui / Mengesahkan,', pageWidth - 65, finalY);
        doc.text('Ketua Panitia Wisuda SMK Negeri 6 Surakarta', pageWidth - 65, finalY + 5);
        doc.setFont('helvetica', 'bold');
        doc.text('( Panitia Wisuda 2024/2027 )', pageWidth - 65, finalY + 20);
      }

      doc.save(`Daftar_Resmi_Tamu_Hadir_SMK6_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('Gagal generate daftar PDF:', err);
      alert('Terjadi kendala saat mengunduh file PDF daftar hadir.');
    }
  };

  // Tambah siswa baru ke Master Data
  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudent.name.trim()) {
      alert('Nama siswa wajib diisi!');
      return;
    }

    const exists = masterStudents.some(s => 
      s.name.toLowerCase().trim() === newStudent.name.toLowerCase().trim() &&
      s.student_class === newStudent.student_class
    );

    if (exists) {
      alert(`Siswa atas nama "${newStudent.name}" sudah terdaftar di kelas ${newStudent.student_class}!`);
      return;
    }

    const createdStudent = {
      id: `CUSTOM-${Date.now()}`,
      name: newStudent.name.trim(),
      student_class: newStudent.student_class
    };

    const updated = [createdStudent, ...masterStudents];
    setMasterStudents(updated);
    saveMasterStudents(updated);

    setNewStudent({
      name: '',
      student_class: newStudent.student_class
    });

    setAddSuccessMsg(`✓ Siswa "${createdStudent.name}" berhasil ditambahkan ke daftar wisuda.`);
    setTimeout(() => setAddSuccessMsg(''), 3000);
  };

  // Hapus siswa dari Master Data
  const handleDeleteMasterStudent = (studentId, studentName) => {
    if (!confirm(`Hapus "${studentName}" dari daftar calon wisudawan resmi? Siswa ini tidak akan bisa mengisi konfirmasi jika dihapus.`)) {
      return;
    }

    const updated = masterStudents.filter(s => s.id !== studentId);
    setMasterStudents(updated);
    saveMasterStudents(updated);
  };

  // Edit Siswa Master (Ubah Kelas atau Nama secara langsung)
  const handleStartEdit = (student) => {
    setEditingStudentId(student.id);
    setEditFormData({
      name: student.name,
      student_class: student.student_class || 'XII RPL'
    });
  };

  const handleCancelEdit = () => {
    setEditingStudentId(null);
    setEditFormData({ name: '', student_class: '' });
  };

  const handleSaveEdit = async (studentId) => {
    if (!editFormData.name.trim()) {
      alert('Nama siswa tidak boleh kosong!');
      return;
    }

    const trimmedName = editFormData.name.trim();
    const classVal = editFormData.student_class.trim();

    // Validasi duplikasi dengan siswa lain
    const duplicate = masterStudents.some(s => 
      s.id !== studentId && 
      s.name.toLowerCase().trim() === trimmedName.toLowerCase() && 
      s.student_class === classVal
    );

    if (duplicate) {
      alert(`Siswa "${trimmedName}" di kelas ${classVal} sudah ada di daftar.`);
      return;
    }

    const oldStudent = masterStudents.find(s => s.id === studentId);
    const oldName = oldStudent ? oldStudent.name : '';

    const updated = masterStudents.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          name: trimmedName,
          student_class: classVal
        };
      }
      return s;
    });

    setMasterStudents(updated);
    saveMasterStudents(updated);

    // Sinkronisasi otomatis ke data respon RSVP jika siswa sudah pernah mengisi kehadiran
    if (oldName) {
      const matchingRsvp = rsvps.find(r => 
        r.name?.toLowerCase().trim() === oldName.toLowerCase().trim()
      );

      if (matchingRsvp) {
        const updatedRsvps = rsvps.map(r => {
          if (r.id === matchingRsvp.id) {
            return {
              ...r,
              name: trimmedName,
              student_class: classVal
            };
          }
          return r;
        });

        setRsvps(updatedRsvps);
        try {
          localStorage.setItem('smk6_rsvps_cache', JSON.stringify(updatedRsvps));
          await supabase
            .from('rsvps')
            .update({ name: trimmedName, student_class: classVal })
            .eq('id', matchingRsvp.id);
        } catch (err) {
          console.warn('Gagal sinkronisasi update data ke Supabase:', err);
        }
      }
    }

    setEditingStudentId(null);
    alert(`Data siswa "${trimmedName}" (${classVal}) berhasil diperbarui!`);
  };

  // Broadcast Link Generator
  const getOfficialWebsiteUrl = () => {
    if (typeof window === 'undefined') return '';
    return window.location.origin;
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedWA(true);
      setTimeout(() => setCopiedWA(false), 2000);
    }
  };

  const getWaBroadcastMessage = () => {
    const link = getOfficialWebsiteUrl();
    return `🎓 *UNDANGAN RESMI WISUDA & PELEPASAN SISWA SMK NEGERI 6 SURAKARTA* 🎓\n\nKepada Yth.\n*Bapak/Ibu Orang Tua / Wali Murid & Seluruh Siswa-Siswi Calon Wisudawan*\nKeluarga Besar Angkatan 2024/2027\n\nDengan hormat, kami mengundang Bapak/Ibu serta ananda untuk menghadiri acara Sidang Terbuka Wisuda & Pelepasan Siswa SMK Negeri 6 Surakarta Angkatan 2024/2027.\n\nDetail susunan acara & formulir konfirmasi kehadiran (RSVP) dapat diakses melalui link resmi berikut:\n👉 ${link}\n\n*Catatan Penting:*\n1. Setiap siswa wajib memilih nama dan kelas sesuai daftar resmi sekolah.\n2. Konfirmasi hanya dapat dilakukan 1 kali per siswa demi mencegah duplikasi kursi.\n3. Alokasi maksimal 3 kursi (1 Siswa + 2 Orang Tua / Pendamping).\n\nTerima kasih atas perhatian dan kerja samanya.\n\n*Panitia Wisuda SMK Negeri 6 Surakarta*`;
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '1.5rem',
        backgroundColor: '#ffffff'
      }}>
        {/* Latar Belakang Gedung Sekolah */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('/images/smk6-depan-web.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 25%',
          opacity: 0.35,
          filter: 'saturate(1.08) contrast(1.02)'
        }} />

        {/* Lapisan Gradien */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at 50% 15%, rgba(197, 155, 39, 0.15) 0%, transparent 55%),
            radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.85) 0%, transparent 75%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.94) 0%, rgba(248, 250, 252, 0.88) 50%, #ffffff 100%)
          `
        }} />

        {/* Kartu Login */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '420px',
          width: '100%',
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(197, 155, 39, 0.35)',
          borderRadius: '24px',
          padding: '2.5rem 2rem',
          boxShadow: '0 20px 50px rgba(15, 43, 92, 0.14), 0 0 25px rgba(197, 155, 39, 0.12)',
          textAlign: 'center'
        }}>
          {/* Logo SMK 6 */}
          <div style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            background: '#ffffff',
            border: '2px solid rgba(197, 155, 39, 0.4)',
            boxShadow: '0 8px 20px rgba(15, 43, 92, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.2rem'
          }}>
            <img
              src="/images/smk6.png"
              alt="Logo Resmi SMK Negeri 6 Surakarta"
              style={{ width: '48px', height: '48px', objectFit: 'contain' }}
            />
          </div>

          <div style={{
            display: 'inline-block',
            fontSize: '0.74rem',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: '#c59b27',
            fontWeight: 700,
            marginBottom: '0.6rem',
            padding: '0.25rem 0.85rem',
            background: '#fcfaf2',
            border: '1px solid rgba(197, 155, 39, 0.25)',
            borderRadius: '20px'
          }}>
            Panel Administrator
          </div>

          <h2 style={{
            fontSize: '1.75rem',
            color: '#0f2b5c',
            fontFamily: 'var(--font-heading)',
            marginBottom: '1.5rem',
            fontWeight: 700
          }}>
            Wisuda SMK Negeri 6
          </h2>

          {/* Notifikasi Jika Kata Sandi Salah */}
          {loginError && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              fontSize: '0.86rem',
              marginBottom: '1.2rem',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <XCircle size={18} />
              <span>Kata sandi tidak sesuai. Silakan coba lagi.</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ position: 'relative', marginBottom: '1.2rem' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Masukkan Kata Sandi Panitia..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (loginError) setLoginError(false);
                }}
                style={{
                  padding: '0.95rem 2.8rem 0.95rem 1rem',
                  fontSize: '0.95rem',
                  borderRadius: '12px',
                  border: loginError ? '1.5px solid #ef4444' : '1.5px solid #cbd5e1',
                  background: '#ffffff',
                  boxShadow: 'none'
                }}
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                title={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                width: '100%',
                padding: '0.95rem',
                fontSize: '0.98rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontWeight: 600,
                letterSpacing: '0.05em'
              }}
            >
              Masuk Dashboard
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.2rem' }}>
            <a
              href="/"
              style={{
                color: '#64748b',
                textDecoration: 'none',
                fontSize: '0.86rem',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#0f2b5c'}
              onMouseLeave={(e) => e.target.style.color = '#64748b'}
            >
              Kembali ke Halaman Undangan
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Perhitungan statistik analitik
  const totalSiswaMaster = masterStudents.length;
  const totalRSVP = rsvps.length;
  const totalHadir = rsvps.filter(r => r.attendance === 'yes').length;
  const totalTidakHadir = rsvps.filter(r => r.attendance === 'no').length;
  const totalBelumKonfirmasi = Math.max(0, totalSiswaMaster - totalRSVP);
  const totalPax = rsvps
    .filter(r => r.attendance === 'yes')
    .reduce((acc, curr) => acc + (parseInt(curr.pax, 10) || 1), 0);

  // Filter pencarian RSVP
  const filteredRsvps = rsvps.filter(r => {
    const q = searchQuery.toLowerCase();
    return (
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.student_class && r.student_class.toLowerCase().includes(q)) ||
      (r.message && r.message.toLowerCase().includes(q))
    );
  });

  // Filter Data Siswa Master
  const filteredMasterStudents = masterStudents.filter(s => {
    const matchClass = filterClass === 'ALL' || s.student_class === filterClass;
    const matchQuery = !studentSearch.trim() || 
      s.name.toLowerCase().includes(studentSearch.toLowerCase());
    return matchClass && matchQuery;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f6f9', padding: '2rem 1.5rem', color: '#333' }}>
      <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
        {/* Header Dashboard */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '2px solid #e0e0e0', paddingBottom: '1.2rem' }}>
          <div>
            <h1 style={{ color: '#0f2b5c', fontSize: '2rem', margin: 0, fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
              Dashboard Panitia Wisuda
            </h1>
            <p style={{ color: '#64748b', margin: '0.3rem 0 0', fontSize: '0.95rem' }}>
              SMK Negeri 6 Surakarta — Angkatan 2024/2027
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button
              onClick={() => window.open('/', '_blank')}
              style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1.5px solid #0f2b5c', background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: '#0f2b5c' }}
            >
              Lihat Undangan Siswa ↗
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontSize: '0.9rem', color: '#64748b' }}
            >
              Keluar
            </button>
          </div>
        </div>

        {/* 6 Kartu Metrik Analitik: Rapi & Seimbang */}
        <div className="admin-metrics-grid">
          <div style={{ background: '#fff', padding: '1.15rem 1rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', borderLeft: '4px solid #0f2b5c' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '1.85rem', fontWeight: 'bold', color: '#0f2b5c', lineHeight: 1.1 }}>{totalSiswaMaster}</div>
                <div style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '0.35rem', fontWeight: 500 }}>Total Calon Wisudawan</div>
              </div>
              <GraduationCap size={24} style={{ color: '#0f2b5c', opacity: 0.55 }} />
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.15rem 1rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', borderLeft: '4px solid #2563eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '1.85rem', fontWeight: 'bold', color: '#2563eb', lineHeight: 1.1 }}>{totalRSVP}</div>
                <div style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '0.35rem', fontWeight: 500 }}>Sudah Konfirmasi</div>
              </div>
              <Users size={24} style={{ color: '#2563eb', opacity: 0.55 }} />
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.15rem 1rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', borderLeft: '4px solid #059669' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '1.85rem', fontWeight: 'bold', color: '#059669', lineHeight: 1.1 }}>{totalHadir}</div>
                <div style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '0.35rem', fontWeight: 500 }}>Siswa Hadir</div>
              </div>
              <CheckCircle size={24} style={{ color: '#059669', opacity: 0.65 }} />
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.15rem 1rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', borderLeft: '4px solid #d97706' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '1.85rem', fontWeight: 'bold', color: '#d97706', lineHeight: 1.1 }}>{totalPax}</div>
                <div style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '0.35rem', fontWeight: 500 }}>Total Kursi Aula</div>
                <small style={{ color: '#94a3b8', fontSize: '0.7rem', display: 'block' }}>*Siswa + Wali</small>
              </div>
              <Armchair size={24} style={{ color: '#d97706', opacity: 0.65 }} />
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.15rem 1rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', borderLeft: '4px solid #ef4444' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '1.85rem', fontWeight: 'bold', color: '#ef4444', lineHeight: 1.1 }}>{totalTidakHadir}</div>
                <div style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '0.35rem', fontWeight: 500 }}>Berhalangan Hadir</div>
              </div>
              <XCircle size={24} style={{ color: '#ef4444', opacity: 0.55 }} />
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.15rem 1rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', borderLeft: '4px solid #94a3b8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '1.85rem', fontWeight: 'bold', color: '#64748b', lineHeight: 1.1 }}>{totalBelumKonfirmasi}</div>
                <div style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '0.35rem', fontWeight: 500 }}>Belum Konfirmasi</div>
              </div>
              <AlertCircle size={24} style={{ color: '#94a3b8', opacity: 0.55 }} />
            </div>
          </div>
        </div>

        {/* Kotak Broadcast WhatsApp Resmi (Untuk Seluruh Angkatan) */}
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <Share2 size={20} style={{ color: '#c59b27' }} />
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f2b5c' }}>Link Undangan & Broadcast WhatsApp Angkatan 2024/2027</h3>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 1rem' }}>
            Bagikan link resmi ini ke grup WhatsApp kelas atau wali murid. Setiap siswa akan memilih nama dan kelasnya sendiri untuk melakukan konfirmasi kehadiran 1 kali.
          </p>

          <div style={{ background: '#f8fafc', padding: '0.9rem 1.1rem', borderRadius: '10px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem' }}>
            <div style={{ fontSize: '0.9rem', color: '#1e293b' }}>
              <strong>URL Undangan:</strong> <span style={{ color: '#0f2b5c', textDecoration: 'underline' }}>{getOfficialWebsiteUrl()}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                onClick={() => copyToClipboard(getOfficialWebsiteUrl(), 'link')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', borderRadius: '8px', border: 'none', background: '#0f2b5c', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
              >
                {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                {copiedLink ? 'Link Tersalin!' : 'Salin Link'}
              </button>
              <button
                onClick={() => copyToClipboard(getWaBroadcastMessage(), 'wa')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 1rem', borderRadius: '8px', border: 'none', background: '#25D366', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
              >
                {copiedWA ? <Check size={16} /> : <Copy size={16} />}
                {copiedWA ? 'Pesan WA Tersalin!' : 'Salin Pesan Broadcast WA'}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigasi Admin */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.4rem' }}>
          <button
            onClick={() => setActiveTab('rsvp')}
            style={{
              padding: '0.7rem 1.4rem',
              borderRadius: '10px 10px 0 0',
              border: 'none',
              background: activeTab === 'rsvp' ? '#0f2b5c' : 'transparent',
              color: activeTab === 'rsvp' ? '#ffffff' : '#64748b',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            <FileText size={18} />
            Data Respon Kehadiran ({rsvps.length})
          </button>

          <button
            onClick={() => setActiveTab('students')}
            style={{
              padding: '0.7rem 1.4rem',
              borderRadius: '10px 10px 0 0',
              border: 'none',
              background: activeTab === 'students' ? '#0f2b5c' : 'transparent',
              color: activeTab === 'students' ? '#ffffff' : '#64748b',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            <GraduationCap size={18} />
            Master Data Siswa Wisuda ({masterStudents.length})
          </button>
        </div>

        {/* TAB 1: DATA KONFIRMASI KEHADIRAN (RSVP) */}
        {activeTab === 'rsvp' && (
          <div style={{ background: '#fff', padding: '1.8rem', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', margin: 0, color: '#0f2b5c', fontWeight: 700 }}>
                  Daftar Konfirmasi Kehadiran Siswa
                </h2>
                <small style={{ color: '#64748b' }}>Data tersinkronisasi otomatis dengan database panitia</small>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={17} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    placeholder="Cari nama atau kelas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: '0.6rem 1rem 0.6rem 2.2rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', width: '220px' }}
                  />
                </div>

                <button
                  onClick={() => handleDownloadAttendingPdf(filteredRsvps)}
                  style={{
                    padding: '0.6rem 1.2rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#059669',
                    color: '#ffffff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 2px 8px rgba(5, 150, 105, 0.2)'
                  }}
                  title="Download file PDF resmi daftar tamu dan wisudawan yang akan hadir"
                >
                  <Download size={15} />
                  Download Tamu Hadir (PDF)
                </button>

                <button
                  onClick={fetchData}
                  style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', background: '#c59b27', color: '#ffffff', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <RefreshCw size={15} />
                  {loading ? 'Memuat...' : 'Refresh'}
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '720px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.84rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '0.85rem 0.6rem' }}>Waktu</th>
                    <th style={{ padding: '0.85rem 0.6rem' }}>Nama Siswa</th>
                    <th style={{ padding: '0.85rem 0.6rem' }}>Kelas</th>
                    <th style={{ padding: '0.85rem 0.6rem' }}>Status</th>
                    <th style={{ padding: '0.85rem 0.6rem' }}>Kursi</th>
                    <th style={{ padding: '0.85rem 0.6rem' }}>Pesan / Doa</th>
                    <th style={{ padding: '0.85rem 0.6rem', textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRsvps.map((rsvp) => (
                    <tr key={rsvp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.9rem 0.6rem', fontSize: '0.82rem', color: '#888', whiteSpace: 'nowrap' }}>
                        {new Date(rsvp.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td style={{ padding: '0.9rem 0.6rem', fontWeight: 600, color: '#0f2b5c' }}>
                        {rsvp.name}
                      </td>
                      <td style={{ padding: '0.9rem 0.6rem' }}>
                        <span style={{ fontSize: '0.8rem', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.2rem 0.6rem', borderRadius: '6px', color: '#334155', fontWeight: 600 }}>
                          {rsvp.student_class || '-'}
                        </span>
                      </td>
                      <td style={{ padding: '0.9rem 0.6rem' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          backgroundColor: rsvp.attendance === 'yes' ? '#ecfdf5' : '#fef2f2',
                          color: rsvp.attendance === 'yes' ? '#059669' : '#dc2626',
                          border: rsvp.attendance === 'yes' ? '1px solid #a7f3d0' : '1px solid #fecaca'
                        }}>
                          {rsvp.attendance === 'yes' ? '✓ Hadir' : '✕ Tidak Hadir'}
                        </span>
                      </td>
                      <td style={{ padding: '0.9rem 0.6rem', fontSize: '0.88rem', fontWeight: 600 }}>
                        {rsvp.attendance === 'yes' ? `${rsvp.pax || 1} Kursi` : '-'}
                      </td>
                      <td style={{ padding: '0.9rem 0.6rem', maxWidth: '280px', fontSize: '0.85rem', lineHeight: '1.4', color: '#4b5563' }}>
                        {rsvp.message || <span style={{ color: '#cbd5e1', fontStyle: 'italic' }}>Tanpa pesan</span>}
                      </td>
                      <td style={{ padding: '0.9rem 0.6rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => handleDeleteRsvp(rsvp.id, rsvp.name)}
                          title="Hapus data konfirmasi ini"
                          style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', padding: '0.35rem' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredRsvps.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '3rem 0', color: '#94a3b8' }}>
                        {searchQuery ? 'Tidak ada data siswa yang cocok dengan kata kunci pencarian.' : 'Belum ada data konfirmasi kehadiran yang masuk.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: DATA MASTER SISWA WISUDA */}
        {activeTab === 'students' && (
          <div>
            {/* Form Tambah Siswa Baru */}
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <UserPlus size={19} style={{ color: '#0f2b5c' }} />
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f2b5c' }}>Tambah Calon Wisudawan Baru</h3>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.86rem', margin: '0 0 1rem' }}>
                Siswa yang terdaftar di sini adalah yang memiliki hak resmi untuk mengisi konfirmasi kehadiran (RSVP) di website.
              </p>

              {addSuccessMsg && (
                <div style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '0.65rem 0.9rem', borderRadius: '8px', fontSize: '0.86rem', marginBottom: '1rem' }}>
                  {addSuccessMsg}
                </div>
              )}

              <form onSubmit={handleAddStudent} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.9rem', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>Nama Lengkap Siswa</label>
                  <input
                    type="text"
                    placeholder="Contoh: Muhammad Rayhan"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>Kelas / Jurusan</label>
                  <select
                    value={newStudent.student_class}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, student_class: e.target.value }))}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', boxSizing: 'border-box', background: '#fff' }}
                  >
                    {SCHOOL_CLASSES.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <button
                    type="submit"
                    style={{ width: '100%', padding: '0.68rem 1rem', borderRadius: '8px', border: 'none', background: '#0f2b5c', color: '#fff', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}
                  >
                    + Daftarkan Siswa
                  </button>
                </div>
              </form>
            </div>

            {/* Tabel Master Siswa & Status Kehadiran */}
            <div style={{ background: '#fff', padding: '1.8rem', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.3rem', margin: 0, color: '#0f2b5c', fontWeight: 700 }}>
                    Daftar Calon Wisudawan Resmi SMK Negeri 6 Surakarta
                  </h2>
                  <small style={{ color: '#64748b' }}>Menampilkan {filteredMasterStudents.length} dari total {masterStudents.length} siswa</small>
                </div>

                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* Filter Kelas */}
                  <select
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                    style={{ padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff', fontWeight: 500 }}
                  >
                    <option value="ALL">Semua Kelas ({masterStudents.length})</option>
                    {SCHOOL_CLASSES.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>

                  {/* Search Siswa */}
                  <div style={{ position: 'relative' }}>
                    <Search size={17} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      placeholder="Cari nama calon wisudawan..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      style={{ padding: '0.6rem 1rem 0.6rem 2.2rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', width: '220px' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.84rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <th style={{ padding: '0.85rem 0.6rem' }}>No.</th>
                      <th style={{ padding: '0.85rem 0.6rem' }}>Nama Calon Wisudawan</th>
                      <th style={{ padding: '0.85rem 0.6rem' }}>Kelas</th>
                      <th style={{ padding: '0.85rem 0.6rem' }}>Status Konfirmasi Kehadiran</th>
                      <th style={{ padding: '0.85rem 0.6rem', textAlign: 'center' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMasterStudents.map((st, idx) => {
                      const isEditing = editingStudentId === st.id;
                      const matchingRsvp = rsvps.find(r => 
                        r.name?.toLowerCase().trim() === st.name.toLowerCase().trim()
                      );

                      return (
                        <tr key={st.id} style={{ borderBottom: '1px solid #f1f5f9', background: isEditing ? '#f8fafc' : 'transparent' }}>
                          <td style={{ padding: '0.85rem 0.6rem', fontSize: '0.82rem', color: '#94a3b8' }}>
                            {idx + 1}
                          </td>

                          {/* Kolom Nama Siswa */}
                          <td style={{ padding: '0.85rem 0.6rem', fontWeight: 600, color: '#0f2b5c' }}>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editFormData.name}
                                onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                                style={{
                                  padding: '0.45rem 0.65rem',
                                  borderRadius: '6px',
                                  border: '1.5px solid #0f2b5c',
                                  fontSize: '0.85rem',
                                  width: '100%',
                                  boxSizing: 'border-box',
                                  fontWeight: 600
                                }}
                                autoFocus
                              />
                            ) : (
                              st.name
                            )}
                          </td>

                          {/* Kolom Kelas & Jurusan */}
                          <td style={{ padding: '0.85rem 0.6rem' }}>
                            {isEditing ? (
                              <select
                                value={editFormData.student_class}
                                onChange={(e) => setEditFormData(prev => ({ ...prev, student_class: e.target.value }))}
                                style={{
                                  padding: '0.45rem 0.65rem',
                                  borderRadius: '6px',
                                  border: '1.5px solid #0f2b5c',
                                  fontSize: '0.82rem',
                                  background: '#fff',
                                  fontWeight: 600
                                }}
                              >
                                {SCHOOL_CLASSES.map(cls => (
                                  <option key={cls} value={cls}>{cls}</option>
                                ))}
                              </select>
                            ) : (
                              <span style={{ fontSize: '0.8rem', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.2rem 0.6rem', borderRadius: '6px', color: '#334155', fontWeight: 600 }}>
                                {st.student_class}
                              </span>
                            )}
                          </td>

                          {/* Kolom Status Konfirmasi */}
                          <td style={{ padding: '0.85rem 0.6rem' }}>
                            {isEditing ? (
                              <span style={{ fontSize: '0.78rem', color: '#0f2b5c', fontWeight: 600, fontStyle: 'italic' }}>
                                ✏️ Mode Edit Data
                              </span>
                            ) : matchingRsvp ? (
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span style={{
                                  padding: '0.25rem 0.75rem',
                                  borderRadius: '20px',
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                  backgroundColor: matchingRsvp.attendance === 'yes' ? '#ecfdf5' : '#fef2f2',
                                  color: matchingRsvp.attendance === 'yes' ? '#059669' : '#dc2626',
                                  border: matchingRsvp.attendance === 'yes' ? '1px solid #a7f3d0' : '1px solid #fecaca'
                                }}>
                                  {matchingRsvp.attendance === 'yes' ? `✓ Sudah Konfirmasi (Hadir - ${matchingRsvp.pax} Kursi)` : '✕ Sudah Konfirmasi (Tidak Hadir)'}
                                </span>
                              </div>
                            ) : (
                              <span style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '20px',
                                fontSize: '0.78rem',
                                fontWeight: 500,
                                backgroundColor: '#fef3c7',
                                color: '#b45309',
                                border: '1px solid #fde68a'
                              }}>
                                ⏳ Belum Mengisi
                              </span>
                            )}
                          </td>

                          {/* Kolom Aksi */}
                          <td style={{ padding: '0.85rem 0.6rem', textAlign: 'center' }}>
                            {isEditing ? (
                              <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                                <button
                                  onClick={() => handleSaveEdit(st.id)}
                                  title="Simpan perubahan nama dan kelas"
                                  style={{
                                    border: 'none',
                                    background: '#059669',
                                    color: '#ffffff',
                                    borderRadius: '6px',
                                    padding: '0.35rem 0.65rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                  }}
                                >
                                  <Check size={13} />
                                  Simpan
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  title="Batalkan perubahan"
                                  style={{
                                    border: '1px solid #cbd5e1',
                                    background: '#ffffff',
                                    color: '#64748b',
                                    borderRadius: '6px',
                                    padding: '0.35rem 0.6rem',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                  }}
                                >
                                  <X size={13} />
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <div style={{ display: 'inline-flex', gap: '0.35rem', alignItems: 'center' }}>
                                <button
                                  onClick={() => handleStartEdit(st)}
                                  title="Edit nama atau kelas siswa ini"
                                  style={{
                                    border: '1px solid #cbd5e1',
                                    background: '#ffffff',
                                    color: '#0f2b5c',
                                    borderRadius: '6px',
                                    padding: '0.35rem 0.6rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                  }}
                                >
                                  <Edit2 size={13} />
                                  Edit
                                </button>
                                {matchingRsvp && (
                                  <button
                                    onClick={() => handleResetStudentConfirmation(st)}
                                    title="Reset konfirmasi siswa ini agar dapat mengisi ulang"
                                    style={{
                                      border: '1px solid #cbd5e1',
                                      background: '#ffffff',
                                      color: '#b45309',
                                      borderRadius: '6px',
                                      padding: '0.35rem 0.6rem',
                                      fontSize: '0.75rem',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.25rem'
                                    }}
                                  >
                                    <RotateCcw size={13} />
                                    Reset
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteMasterStudent(st.id, st.name)}
                                  title="Hapus dari daftar calon wisudawan"
                                  style={{
                                    border: 'none',
                                    background: 'transparent',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    padding: '0.35rem'
                                  }}
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {filteredMasterStudents.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '2.5rem 0', color: '#94a3b8' }}>
                          Tidak ada siswa yang sesuai dengan filter atau pencarian.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
