export const metadata = {
  title: 'SEAT Marketing Dashboard',
  description: 'Dashboard ejecutivo de Google Ads y Meta Ads - Grupo Safamotor',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
