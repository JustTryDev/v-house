import { defineRouting } from "next-intl/routing";

/**
 * 📌 다국어 라우팅 설정
 *
 * 이 파일은 "교통 표지판" 같은 역할을 합니다.
 * 어떤 언어로 어디로 갈지 알려주는 설정이에요.
 *
 * - locales: 지원하는 언어 목록
 * - defaultLocale: 기본 언어 (베트남어)
 * - localePrefix: URL에 언어 코드를 항상 표시
 */
export const routing = defineRouting({
  // 지원하는 언어: 베트남어, 한국어, 영어
  locales: ["vi", "ko", "en"],

  // 기본 언어: 베트남어 (타겟 사용자가 베트남인이므로)
  defaultLocale: "vi",

  // URL에 항상 언어 코드 표시 (/vi, /ko, /en)
  localePrefix: "always",
});

// 타입 내보내기
export type Locale = (typeof routing.locales)[number];
