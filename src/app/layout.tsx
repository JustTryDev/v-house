import type { Metadata } from "next";
import "./globals.css";

/**
 * 📌 루트 레이아웃
 *
 * 이 파일은 "건물의 기초"와 같습니다.
 * 모든 페이지가 이 레이아웃 위에 올라갑니다.
 *
 * Next.js App Router에서는 루트 레이아웃에
 * html, body 태그가 필수입니다.
 *
 * 📌 폰트 전략:
 * - Pretendard: 한글, 영어 (CDN으로 로드)
 * - Be Vietnam Pro: 베트남어 특수 문자 지원 (Google Font)
 *
 * Pretendard는 라틴 기본 문자를 지원하지만,
 * 베트남어의 특수 기호(dấu)가 있는 문자는
 * Be Vietnam Pro가 더 잘 표현합니다.
 */
export const metadata: Metadata = {
  title: "V-HOUSE",
  description: "Your Vietnamese Home in Korea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        {/* Pretendard 폰트 (한글/영어) - CDN */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        {/* Be Vietnam Pro 폰트 (베트남어) - Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* flag-icons (국기 아이콘) - CDN */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/flag-icons/css/flag-icons.min.css"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
