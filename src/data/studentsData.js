// Data Master Siswa Calon Wisudawan SMK Negeri 6 Surakarta
// Angkatan 2024/2027

export const SCHOOL_CLASSES = [
  'XII RPL',
  'XII RPL 1',
  'XII RPL 2',
  'XII AKL',
  'XII MP',
  'XII DKV'
];

export const INITIAL_STUDENTS = [
  { id: 'SISWA-01', nis: '240101', name: "Muhammad Ba'sin Khoirur Roziqin Raharjo", student_class: 'XII RPL' },
  { id: 'SISWA-02', nis: '240102', name: 'Lubaid Arfa Casilas', student_class: 'XII RPL' },
  { id: 'SISWA-03', nis: '240103', name: 'Donald Terrifortino', student_class: 'XII RPL' },
  { id: 'SISWA-04', nis: '240104', name: 'Mohammad Hilmi Azzam', student_class: 'XII RPL' },
  { id: 'SISWA-05', nis: '240105', name: 'Abryan Yoga Pratama', student_class: 'XII RPL' },
  { id: 'SISWA-06', nis: '240106', name: 'Byatara Ade Wisnu Brata', student_class: 'XII RPL' },
  { id: 'SISWA-07', nis: '240107', name: 'Muhammad Zidane', student_class: 'XII RPL' },
  { id: 'SISWA-08', nis: '240108', name: 'Alvaro Danendra Kurniawanb', student_class: 'XII RPL' },
  { id: 'SISWA-09', nis: '240109', name: 'Adrian Valentino', student_class: 'XII RPL' },
  { id: 'SISWA-10', nis: '240110', name: 'Valentino Santoso', student_class: 'XII RPL' },
  { id: 'SISWA-11', nis: '240111', name: 'Stefano Budi', student_class: 'XII RPL' },
  { id: 'SISWA-12', nis: '240112', name: 'Aziz Ahmad Juniar', student_class: 'XII RPL' },
  { id: 'SISWA-13', nis: '240113', name: 'Junior Alfrefo Berned', student_class: 'XII RPL' },
  { id: 'SISWA-14', nis: '240114', name: 'Damay Mada Setyawan', student_class: 'XII RPL' },
  { id: 'SISWA-15', nis: '240115', name: 'Desiderius Aditya', student_class: 'XII RPL' },
  { id: 'SISWA-16', nis: '240116', name: 'Kritiano Agustav', student_class: 'XII RPL' }
];

const LOCAL_STORAGE_KEY = 'smk6_graduates_master_v2';

// Mengambil data siswa dari localStorage jika ada, atau fallback ke INITIAL_STUDENTS
export function getMasterStudents() {
  if (typeof window === 'undefined') return INITIAL_STUDENTS;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback if parse fails
  }
  return INITIAL_STUDENTS;
}

// Menyimpan data master siswa ke localStorage
export function saveMasterStudents(students) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(students));
  } catch {
    console.error('Failed to save master students to localStorage');
  }
}
