import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Lakaya'm",
  description: "Discover Haiti, one city at a time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <header className="border-b border-haiti-teal/20 dark:border-haiti-navy bg-white/90 dark:bg-haiti-midnight/90 backdrop-blur">
          <nav className="container-lg flex items-center justify-between py-4">
            <Link href="/" className="text-xl font-bold text-brand hover:text-brand-dark transition-colors">
              Lakaya&apos;m
            </Link>
            <div className="flex gap-3">
              <Link className="btn hover:border-brand/50 hover:bg-brand/5" href="/departments">
                Departments
              </Link>
              <Link className="btn hover:border-brand/50 hover:bg-brand/5" href="/about">
                About
              </Link>
            </div>
          </nav>
        </header>
        <main className="container-lg py-8">{children}</main>
        <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} Lakaya&apos;m · Made in Cap-Haïtien with ❤️
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
