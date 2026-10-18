import './globals.css'

export const metadata = {
  title: 'Undangan Wisuda SMK Negeri 6 Surakarta',
  description: 'Undangan Resmi Wisuda & Pelepasan Siswa-Siswi Angkatan 2024',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
