import "@/app/ui/global.css"
import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"
import { ThemeProvider } from "next-themes"
import PageTransition from "./components/PageTransition"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className="bg-neutral-100 dark:bg-neutral-950
                   text-black dark:text-white
                   transition-colors duration-300"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Navbar trên cùng */}
          <Navbar />

          <div className="flex pt-16">
            {/* Sidebar bên trái */}
            <Sidebar />

            {/* Content */}
            <main
              className="flex-1
                         pl-20 md:pl-20
                         min-h-screen
                         p-10
                         transition-all duration-300"
            >
              <PageTransition>
                {children}
              </PageTransition>
            </main>
          </div>

          {/* ===== WATERMARK ===== */}
          <div className="fixed bottom-6 right-8 z-[9999] pointer-events-none select-none">
            <p className="text-lg md:text-xl text-gray-400/70 dark:text-gray-500/70 font-medium tracking-wide">
              nhnm - 2026
            </p>
          </div>

        </ThemeProvider>
      </body>
    </html>
  )
}
