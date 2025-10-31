import "./globals.css";
import Link from "next/link";
import { DatabaseStatus } from "@/components/dev/DatabaseStatus";

export const metadata = {
  title: "Lakaya'm",
  description: "Discover Haiti, one city at a time.",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <header className="border-b border-amber-200/30 dark:border-amber-400/20 bg-slate-800/95 backdrop-blur" style={{backgroundColor: 'rgba(30, 41, 59, 0.95)'}}>
          <nav className="container-lg flex items-center justify-between py-3 md:py-4 px-4 md:px-6">
            <Link href="/" className="text-lg md:text-xl font-bold text-amber-400 hover:text-amber-300 transition-colors">
              Lakaya&apos;m
            </Link>
            <div className="flex gap-2 md:gap-3">
              <Link className="btn hover:border-amber-400/50 hover:bg-amber-500/20 text-white text-sm md:text-base" href="/map">
                Map
              </Link>
              <Link className="btn hover:border-amber-400/50 hover:bg-amber-500/20 text-white text-sm md:text-base" href="/about">
                About
              </Link>
              <Link className="btn hover:border-amber-400/50 hover:bg-amber-500/20 text-white text-sm md:text-base" href="/auth/login">
                Log In
              </Link>
            </div>
          </nav>
        </header>
        <main className="min-h-screen" style={{backgroundColor: '#1e293b'}}>{children}</main>
        <footer className="bg-slate-800 dark:bg-slate-900 border-t-2 border-amber-400/30 relative">
          {/* Golden top accent line */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
          
          <div className="max-w-7xl mx-auto px-6 py-12 relative">
            {/* Subtle golden corner accents */}
            <div className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-amber-400/20"></div>
            <div className="absolute top-6 right-6 w-8 h-8 border-r-2 border-t-2 border-amber-400/20"></div>
            
            <div className="grid md:grid-cols-3 gap-8 items-center">
              
              {/* Logo & Slogan */}
              <div className="text-center md:text-left relative">
                <Link href="/home" className="text-2xl font-bold text-white hover:text-amber-300 transition-colors duration-300 relative">
                  Lakaya&apos;m
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <p className="text-amber-200 text-sm mt-2 font-light">
                  Discover the soul of Haiti
                </p>
              </div>

              {/* Navigation Links */}
              <div className="flex justify-center">
                <nav className="flex gap-8 relative">
                  <div className="absolute -top-2 -bottom-2 left-1/2 transform -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-amber-400/30 to-transparent"></div>
                  <Link 
                    href="/departments" 
                    className="text-white/80 hover:text-amber-200 transition-colors duration-300 text-sm font-medium relative group"
                  >
                    Departments
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link 
                    href="/about" 
                    className="text-white/80 hover:text-amber-200 transition-colors duration-300 text-sm font-medium relative group"
                  >
                    About
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <Link 
                    href="/home" 
                    className="text-white/80 hover:text-amber-200 transition-colors duration-300 text-sm font-medium relative group"
                  >
                    Home
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </nav>
              </div>

              {/* Social Links */}
              <div className="flex justify-center md:justify-end gap-4">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-white/10 border border-amber-400/20 rounded-full flex items-center justify-center hover:bg-amber-400/20 hover:border-amber-400/50 transition-all duration-300 group"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5 text-white group-hover:text-amber-100" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-white/10 border border-amber-400/20 rounded-full flex items-center justify-center hover:bg-amber-400/20 hover:border-amber-400/50 transition-all duration-300 group"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5 text-white group-hover:text-amber-100" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-white/10 border border-amber-400/20 rounded-full flex items-center justify-center hover:bg-amber-400/20 hover:border-amber-400/50 transition-all duration-300 group"
                  aria-label="TikTok"
                >
                  <svg className="w-5 h-5 text-white group-hover:text-amber-100" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-amber-400/20 mt-8 pt-8 text-center relative">
              <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-amber-400 rotate-45"></div>
              <p className="text-white/60 text-sm">
                © {new Date().getFullYear()} Lakaya&apos;m · Built by{' '}
                <a 
                  href="https://byzewo.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-300 hover:text-amber-200 transition-colors duration-300 font-medium"
                >
                  Zewo
                </a>
              </p>
            </div>
          </div>
        </footer>
        <DatabaseStatus />
      </body>
    </html>
  );
}
