import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * 📌 다국어 미들웨어
 *
 * 미들웨어는 "입구 경비원" 같은 역할을 합니다.
 * 사용자가 사이트에 들어올 때마다 실행되어:
 *
 * 1. URL에 언어 코드가 없으면 → 기본 언어(베트남어)로 리다이렉트
 *    예: "/" → "/vi"
 *
 * 2. 브라우저의 언어 설정을 감지하여 적절한 언어로 안내
 *
 * 3. 지원하지 않는 언어 요청 → 기본 언어로 대체
 *
 * 제외되는 경로:
 * - /admin/* : 관리자 페이지 (언어 prefix 없음)
 */
export default createMiddleware(routing);

export const config = {
  // 미들웨어가 적용될 경로 설정
  // 다음 경로는 제외됩니다:
  // - /api/* : API 라우트
  // - /trpc/* : tRPC 라우트
  // - /_next/* : Next.js 내부 파일
  // - /_vercel/* : Vercel 내부 파일
  // - /admin/* : 관리자 페이지
  // - 파일 확장자가 있는 경로 (favicon.ico, robots.txt 등)
  matcher: "/((?!api|trpc|_next|_vercel|admin|.*\\..*).*)",
};
