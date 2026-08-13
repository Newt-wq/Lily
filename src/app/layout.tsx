import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/components/AudioProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Selamat Ulang Tahun Kamilah 🌸",
  description: "Sebuah kejutan kecil yang dibuat dengan cinta untuk Siti Kamilah, S.Psi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-lily-cream">
        <AudioProvider>
          {children}
        </AudioProvider>
      </body>
    </html>
  );
}
