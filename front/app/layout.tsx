import '@/styles/globals.css'

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main className="bg-gray-50">{children}</main>
      </body>
    </html>
  )
}
