import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BackToTop from "@/components/BackToTop";
import FloatingInquiry from "@/components/FloatingInquiry";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pcmap-hue.vercel.app"),
  title: "PC맵 - 허위 출장 없는 진짜 우리 동네 컴퓨터 수리점",
  description: "PC맵에서 검증된 우리 동네 오프라인 수리점을 확인하세요. 허위 광고 없는 투명한 컴퓨터 수리 서비스를 제공합니다.",
  keywords: ["컴퓨터 수리", "PC 수리", "수리점 찾기", "동네 수리점", "노트북 수리", "조립 PC", "PC맵"],
  authors: [{ name: "PCMAP" }],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://pcmap-hue.vercel.app",
    title: "PC맵 - 허위 출장 없는 진짜 우리 동네 컴퓨터 수리점",
    description: "PC맵에서 검증된 우리 동네 오프라인 수리점을 확인하세요. 허위 광고 없는 투명한 컴퓨터 수리 서비스를 제공합니다.",
    siteName: "PC맵",
    images: [
      {
        url: "https://pcmap-hue.vercel.app/logo.png",
        width: 800,
        height: 600,
        alt: "PC맵 로고",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PC맵 - 허위 출장 없는 진짜 우리 동네 컴퓨터 수리점",
    description: "PC맵에서 검증된 우리 동네 오프라인 수리점을 확인하세요.",
    images: ["https://pcmap-hue.vercel.app/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <BackToTop />
        <FloatingInquiry />
      </body>
    </html>
  );
}
