import type { Metadata } from "next";
import { Poppins, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "AI로 펼치는 미래 — OZ 코딩스쿨 × DACON | AI 헬스케어 초격차 부트캠프",
  description: "진단을 넘어, 예측의 시대로. 미래는 준비하는 자의 것, 우리는 데이터를 다루고, 사람을 바라본다.",
  keywords: ["AI 헬스케어", "의료 AI", "딥러닝", "머신러닝", "데이터 사이언스", "OZ 코딩스쿨", "DACON", "부트캠프"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${poppins.variable} ${robotoMono.variable} antialiased`}>
        <ThemeProvider attribute="class" forcedTheme="light" disableTransitionOnChange>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
