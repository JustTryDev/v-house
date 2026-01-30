import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/**
 * 📌 Next.js 설정 파일
 *
 * 웹사이트의 전체 설정을 관리합니다.
 * 마치 "자동차 설정판"처럼 다양한 기능을 제어합니다.
 */

// next-intl 플러그인 설정
// 다국어(i18n) 지원을 위한 플러그인입니다
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // 📌 이미지 최적화 설정
  images: {
    // 외부 이미지 도메인 허용
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // 이미지 포맷 (WebP, AVIF 지원)
    formats: ["image/avif", "image/webp"],
  },

  // 📌 보안 헤더
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // 📌 리다이렉트 설정
  async redirects() {
    return [
      // 루트 경로 접근시 베트남어 페이지로 리다이렉트
      {
        source: "/",
        destination: "/vi",
        permanent: false,
      },
    ];
  },
};

// withNextIntl로 감싸서 다국어 기능 활성화
export default withNextIntl(nextConfig);
