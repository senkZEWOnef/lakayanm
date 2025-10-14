import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Lakayan’m",
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
        <header className="border-b border-zinc-200 dark:border-zinc-800">
          <nav className="container-lg flex items-center justify-between py-4">
            <Link href="/" className="text-xl font-bold">
              Lakayan’m
            </Link>
            <div className="flex gap-3">
              <Link className="btn" href="/departments">
                Departments
              </Link>
              <Link className="btn" href="/about">
                About
              </Link>
            </div>
          </nav>
        </header>
        <main className="container-lg py-8">{children}</main>
        <footer className="mt-16 border-t border-zinc-200 dark:border-zinc-800">
          <div className="container-lg py-6 text-sm sub">
            © {new Date().getFullYear()} Lakayan’m · From Cap-Haïtien, with love
          </div>
        </footer>
      </body>
    </html>
  );
}
