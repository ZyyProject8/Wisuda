import './globals.css'

export const metadata = {
  title: 'Undangan Wisuda SMK Negeri 6 Surakarta',
  description: 'Undangan Resmi Wisuda & Pelepasan Siswa-Siswi Angkatan Ke-24 Tahun Ajaran 2026/2027',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
