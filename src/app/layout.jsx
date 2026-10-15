import './globals.css'

export const metadata = {
  title: 'Undangan Wisuda & Pelepasan Siswa - SMK Negeri 1',
  description: 'Undangan Resmi Wisuda & Pelepasan Siswa-Siswi Angkatan 2026',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
