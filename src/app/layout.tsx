import type { Metadata } from "next";
import { Inter, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ระบบค้นหาสลิปเงินเดือน",
  description: "ระบบค้นหาและดาวน์โหลดสลิปเงินเดือนสำหรับพนักงาน",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${inter.variable} ${notoSansThai.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          window.onerror = function(msg, url, line, col, error) {
            var errDiv = document.createElement('div');
            errDiv.style.position = 'fixed';
            errDiv.style.top = '0';
            errDiv.style.left = '0';
            errDiv.style.width = '100%';
            errDiv.style.background = '#dc2626';
            errDiv.style.color = 'white';
            errDiv.style.padding = '20px';
            errDiv.style.zIndex = '999999';
            errDiv.style.wordBreak = 'break-all';
            errDiv.style.fontSize = '14px';
            errDiv.innerHTML = '<b>🚨 [System Crash]</b><br/>' + msg + '<br/><small>Line: ' + line + ', Col: ' + col + '</small>';
            document.body.appendChild(errDiv);
          };
          window.onunhandledrejection = function(e) {
            var errDiv = document.createElement('div');
            errDiv.style.position = 'fixed';
            errDiv.style.bottom = '0';
            errDiv.style.left = '0';
            errDiv.style.width = '100%';
            errDiv.style.background = '#d97706';
            errDiv.style.color = 'white';
            errDiv.style.padding = '20px';
            errDiv.style.zIndex = '999999';
            errDiv.style.wordBreak = 'break-all';
            errDiv.style.fontSize = '14px';
            errDiv.innerHTML = '<b>⚠️ [Network/Promise Error]</b><br/>' + (e.reason ? e.reason.message || e.reason : 'Unknown reason');
            document.body.appendChild(errDiv);
          };
        `}} />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-brand-50 text-slate-800">{children}</body>
    </html>
  );
}
