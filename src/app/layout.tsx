import type { Metadata, Viewport } from "next";
import { Cairo, Noto_Naskh_Arabic, Reem_Kufi } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const cairo = Cairo({ subsets: ["arabic", "latin"], weight: ["400", "700", "900"], variable: "--font-cairo", display: "swap" });
const naskh = Noto_Naskh_Arabic({ subsets: ["arabic"], weight: ["400", "500", "700"], variable: "--font-naskh", display: "swap" });
const reem = Reem_Kufi({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-reem", display: "swap" });

export const metadata: Metadata = {
  title: "عربي١٠٠ — Arabic 100",
  description: "منصة تعليمية تفاعلية لمهارات اللغة العربية: الكتابة، والبلاغة، والقواعد والإملاء، والقراءة والاستيعاب.",
};

export const viewport: Viewport = {
  themeColor: "#0B0F0C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${naskh.variable} ${reem.variable}`}>
      <body className="grain antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-lime focus:px-4 focus:py-2 focus:text-ink">
          تخطَّ إلى المحتوى
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
