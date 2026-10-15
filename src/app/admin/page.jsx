"use client";
import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Users, CheckCircle, XCircle, Lock, Copy, Check, Search, Trash2, Link as LinkIcon, Armchair } from 'lucide-react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // State untuk Link Generator
  const [genName, setGenName] = useState('');
  const [genClass, setGenClass] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedWA, setCopiedWA] = useState(false);

  // Password admin (dapat diatur lewat environment variable atau default 'admin')
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin';

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert('Password salah! (Default: admin)');
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
      }
    } catch {
      console.error('Error fetching data from Supabase');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data konfirmasi ini?')) return;
    try {
      const { error } = await supabase
        .from('rsvps')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRsvps(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert('Gagal menghapus data: ' + err.message);
    }
  };

  // Generate invitation link
  const getGeneratedUrl = () => {
    if (typeof window === 'undefined') return '';
    const baseUrl = window.location.origin;
    const params = new URLSearchParams();
    if (genName.trim()) params.append('to', genName.trim());
    if (genClass.trim()) params.append('kelas', genClass.trim());
    return `${baseUrl}/?${params.toString()}`;
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

  const getWaMessage = () => {
    const link = getGeneratedUrl();
    return `🎓 *UNDANGAN RESMI WISUDA & PELEPASAN SISWA SMK NEGERI 1* 🎓\n\nKepada Yth.\n*${genName || 'Siswa/i'}* ${genClass ? `(${genClass})` : ''}\nBeserta 1 Orang Tua / Pendamping (Maks. 2 Kursi)\n\nDengan hormat, kami mengundang Bapak/Ibu serta ananda untuk menghadiri acara Wisuda & Pelepasan Siswa Angkatan 2026.\n\nDetail acara & formulir konfirmasi kehadiran dapat diakses melalui link undangan resmi berikut:\n👉 ${link}\n\n*Catatan: Setiap siswa mendapatkan alokasi maksimal 2 kursi (Siswa + 1 Pendamping).\nMohon konfirmasi kehadiran demi kelancaran persiapan kursi & konsumsi.\nTerima kasih.`;
  };

  if (!isAuthenticated) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f0f1a'}}>
        <div className="glass-card" style={{maxWidth: '400px', width: '100%', textAlign: 'center', background: '#ffffff', border: '1px solid #eaeaea', padding: '2.5rem', borderRadius: '16px'}}>
          <Lock size={44} style={{color: '#1a1a2e', margin: '0 auto 1rem'}} />
          <h2 style={{marginBottom: '0.5rem', color: '#1a1a2e', fontSize: '1.8rem'}}>Portal Panitia Wisuda</h2>
          <p style={{color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem'}}>Masukkan kata sandi panitia untuk melihat data</p>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Masukkan Kata Sandi..." 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{marginBottom: '1rem', color: '#000', borderColor: '#ccc', backgroundColor: '#fafafa', padding: '0.8rem 1rem'}}
              required
            />
            <button type="submit" className="btn-primary" style={{width: '100%', padding: '0.9rem'}}>Masuk</button>
          </form>
          <p style={{fontSize: '0.8rem', marginTop: '1.2rem', color: '#888'}}>*Kata sandi bawaan: <code>admin</code></p>
        </div>
      </div>
    );
  }

  // Perhitungan statistik
  const totalRSVP = rsvps.length;
  const totalHadir = rsvps.filter(r => r.attendance === 'yes').length;
  const totalTidakHadir = rsvps.filter(r => r.attendance === 'no').length;
  // Menghitung total kursi/orang (pax)
  const totalPax = rsvps
    .filter(r => r.attendance === 'yes')
    .reduce((acc, curr) => acc + (parseInt(curr.pax, 10) || 1), 0);

  // Filter pencarian
  const filteredRsvps = rsvps.filter(r => {
    const q = searchQuery.toLowerCase();
    return (
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.student_class && r.student_class.toLowerCase().includes(q)) ||
      (r.message && r.message.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f4f6f9', padding: '2rem 1.5rem', color: '#333'}}>
      <div style={{maxWidth: '1100px', margin: '0 auto'}}>
        {/* Header */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '2px solid #e0e0e0', paddingBottom: '1.2rem'}}>
          <div>
            <h1 style={{color: '#1a1a2e', fontSize: '2rem', margin: 0, fontWeight: 700}}>
              Dashboard Panitia Wisuda
            </h1>
            <p style={{color: '#666', margin: '0.3rem 0 0', fontSize: '0.95rem'}}>SMK Negeri 1 — Angkatan 2026</p>
          </div>
          <div style={{display: 'flex', gap: '0.8rem'}}>
            <button 
              onClick={() => window.open('/', '_blank')} 
              style={{padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #1a1a2e', background: '#fff', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem'}}
            >
              Lihat Undangan Siswa ↗
            </button>
            <button 
              onClick={() => setIsAuthenticated(false)} 
              style={{padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer', fontSize: '0.9rem', color: '#666'}}
            >
              Keluar
            </button>
          </div>
        </div>
        
        {/* Statistik Kursi & Tamu */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', marginBottom: '2.5rem'}}>
          <div style={{background: '#fff', padding: '1.5rem', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', borderLeft: '5px solid #1a1a2e'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <div style={{fontSize: '2.2rem', fontWeight: 'bold', color: '#1a1a2e'}}>{totalRSVP}</div>
                <div style={{color: '#666', fontSize: '0.9rem', marginTop: '0.2rem'}}>Total Siswa Merespon</div>
              </div>
              <Users size={32} style={{color: '#1a1a2e', opacity: 0.6}} />
            </div>
          </div>

          <div style={{background: '#fff', padding: '1.5rem', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', borderLeft: '5px solid #27ae60'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <div style={{fontSize: '2.2rem', fontWeight: 'bold', color: '#27ae60'}}>{totalHadir}</div>
                <div style={{color: '#666', fontSize: '0.9rem', marginTop: '0.2rem'}}>Siswa Konfirmasi Hadir</div>
              </div>
              <CheckCircle size={32} style={{color: '#27ae60', opacity: 0.7}} />
            </div>
          </div>

          <div style={{background: '#fff', padding: '1.5rem', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', borderLeft: '5px solid #d97706'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <div style={{fontSize: '2.2rem', fontWeight: 'bold', color: '#d97706'}}>{totalPax}</div>
                <div style={{color: '#666', fontSize: '0.9rem', marginTop: '0.2rem'}}>Estimasi Kursi & Konsumsi</div>
                <small style={{color: '#888', fontSize: '0.75rem'}}>*Siswa + Orang Tua Hadir</small>
              </div>
              <Armchair size={32} style={{color: '#d97706', opacity: 0.7}} />
            </div>
          </div>

          <div style={{background: '#fff', padding: '1.5rem', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', borderLeft: '5px solid #c0392b'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <div>
                <div style={{fontSize: '2.2rem', fontWeight: 'bold', color: '#c0392b'}}>{totalTidakHadir}</div>
                <div style={{color: '#666', fontSize: '0.9rem', marginTop: '0.2rem'}}>Berhalangan Hadir</div>
              </div>
              <XCircle size={32} style={{color: '#c0392b', opacity: 0.7}} />
            </div>
          </div>
        </div>

        {/* Generator Link Undangan Siswa */}
        <div style={{background: '#fff', padding: '1.8rem', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', marginBottom: '2.5rem', border: '1px solid #e8e8e8'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem'}}>
            <LinkIcon size={20} style={{color: '#c5a880'}} />
            <h3 style={{margin: 0, fontSize: '1.25rem', color: '#1a1a2e'}}>Generator Link Undangan Siswa</h3>
          </div>
          <p style={{color: '#666', fontSize: '0.9rem', marginBottom: '1.2rem'}}>
            Ketik nama dan kelas siswa untuk membuat link khusus yang akan langsung mempersonalisasi kartu undangan siswa dan orang tua.
          </p>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem'}}>
            <div>
              <label style={{display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#444', marginBottom: '0.3rem'}}>Nama Siswa</label>
              <input 
                type="text" 
                placeholder="Contoh: Ahmad Rizki"
                value={genName}
                onChange={(e) => setGenName(e.target.value)}
                style={{width: '100%', padding: '0.7rem 0.9rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box'}}
              />
            </div>
            <div>
              <label style={{display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#444', marginBottom: '0.3rem'}}>Kelas / Jurusan</label>
              <input 
                type="text" 
                placeholder="Contoh: XII RPL 1"
                value={genClass}
                onChange={(e) => setGenClass(e.target.value)}
                style={{width: '100%', padding: '0.7rem 0.9rem', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box'}}
              />
            </div>
          </div>

          {/* Generated Result Box */}
          <div style={{background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem'}}>
            <div style={{wordBreak: 'break-all', fontSize: '0.9rem', color: '#1e293b', flex: 1}}>
              <strong>Preview Link:</strong> {getGeneratedUrl()}
            </div>
            <div style={{display: 'flex', gap: '0.6rem'}}>
              <button 
                onClick={() => copyToClipboard(getGeneratedUrl(), 'link')}
                style={{display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1rem', borderRadius: '6px', border: 'none', background: '#1a1a2e', color: '#fff', cursor: 'pointer', fontSize: '0.85rem'}}
              >
                {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                {copiedLink ? 'Tersalin!' : 'Salin Link'}
              </button>
              <button 
                onClick={() => copyToClipboard(getWaMessage(), 'wa')}
                style={{display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1rem', borderRadius: '6px', border: 'none', background: '#25D366', color: '#fff', cursor: 'pointer', fontSize: '0.85rem'}}
              >
                {copiedWA ? <Check size={16} /> : <Copy size={16} />}
                {copiedWA ? 'Teks WA Tersalin!' : 'Salin Pesan WA'}
              </button>
            </div>
          </div>
        </div>

        {/* Tabel Data Respon Siswa */}
        <div style={{background: '#fff', padding: '1.8rem', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem'}}>
            <h2 style={{fontSize: '1.35rem', margin: 0, color: '#1a1a2e'}}>Daftar Konfirmasi Kehadiran Siswa</h2>
            
            <div style={{display: 'flex', gap: '0.8rem', alignItems: 'center'}}>
              {/* Search Bar */}
              <div style={{position: 'relative'}}>
                <Search size={18} style={{position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#888'}} />
                <input 
                  type="text" 
                  placeholder="Cari nama atau kelas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{padding: '0.6rem 1rem 0.6rem 2.2rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.85rem', width: '220px'}}
                />
              </div>

              <button 
                onClick={fetchData} 
                style={{padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', background: '#c5a880', color: '#1a1a2e', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem'}}
              >
                {loading ? 'Memuat...' : 'Refresh Data'}
              </button>
            </div>
          </div>
          
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px'}}>
              <thead>
                <tr style={{borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                  <th style={{padding: '1rem 0.6rem'}}>Waktu</th>
                  <th style={{padding: '1rem 0.6rem'}}>Nama Siswa</th>
                  <th style={{padding: '1rem 0.6rem'}}>Kelas</th>
                  <th style={{padding: '1rem 0.6rem'}}>Status</th>
                  <th style={{padding: '1rem 0.6rem'}}>Kursi (Pax)</th>
                  <th style={{padding: '1rem 0.6rem'}}>Kesan & Pesan</th>
                  <th style={{padding: '1rem 0.6rem', textAlign: 'center'}}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredRsvps.map((rsvp) => (
                  <tr key={rsvp.id} style={{borderBottom: '1px solid #f1f5f9'}}>
                    <td style={{padding: '1rem 0.6rem', fontSize: '0.85rem', color: '#888', whiteSpace: 'nowrap'}}>
                      {new Date(rsvp.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td style={{padding: '1rem 0.6rem', fontWeight: 600, color: '#1a1a2e'}}>
                      {rsvp.name}
                    </td>
                    <td style={{padding: '1rem 0.6rem'}}>
                      <span style={{fontSize: '0.8rem', background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '6px', color: '#475569'}}>
                        {rsvp.student_class || '-'}
                      </span>
                    </td>
                    <td style={{padding: '1rem 0.6rem'}}>
                      <span style={{
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '20px', 
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        backgroundColor: rsvp.attendance === 'yes' ? 'rgba(46, 204, 113, 0.15)' : 'rgba(231, 76, 60, 0.15)',
                        color: rsvp.attendance === 'yes' ? '#27ae60' : '#c0392b'
                      }}>
                        {rsvp.attendance === 'yes' ? 'Hadir' : 'Tidak Hadir'}
                      </span>
                    </td>
                    <td style={{padding: '1rem 0.6rem', fontSize: '0.9rem', fontWeight: 500}}>
                      {rsvp.attendance === 'yes' ? `${rsvp.pax || 1} Kursi` : '-'}
                    </td>
                    <td style={{padding: '1rem 0.6rem', maxWidth: '280px', fontSize: '0.85rem', lineHeight: '1.4', color: '#555'}}>
                      {rsvp.message || <span style={{color: '#bbb', fontStyle: 'italic'}}>Tanpa pesan</span>}
                    </td>
                    <td style={{padding: '1rem 0.6rem', textAlign: 'center'}}>
                      <button 
                        onClick={() => handleDelete(rsvp.id)}
                        title="Hapus data"
                        style={{border: 'none', background: 'transparent', color: '#e74c3c', cursor: 'pointer', padding: '0.3rem'}}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredRsvps.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{textAlign: 'center', padding: '3rem 0', color: '#94a3b8'}}>
                      {searchQuery ? 'Tidak ada data siswa yang cocok dengan pencarian.' : 'Belum ada data konfirmasi kehadiran yang masuk.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
