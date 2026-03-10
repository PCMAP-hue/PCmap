import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PC맵 - 허위 출장 없는 진짜 우리 동네 컴퓨터 수리점",
  description: "PC맵에서 검증된 우리 동네 오프라인 수리점을 확인하세요.",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "PC맵 - 허위 출장 없는 진짜 우리 동네 컴퓨터 수리점",
    description: "PC맵에서 검증된 우리 동네 오프라인 수리점을 확인하세요.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
