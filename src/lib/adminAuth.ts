/**
 * 📌 관리자 인증 유틸리티
 *
 * 간단한 비밀번호 기반 인증 시스템입니다.
 * 마치 "금고 비밀번호"처럼 관리자만 접근할 수 있게 합니다.
 *
 * 보안 참고:
 * - 실제 운영 환경에서는 더 안전한 인증 방식(Convex Auth 등) 권장
 * - 현재는 빠른 개발을 위한 간단한 방식 사용
 */

// 관리자 비밀번호 (환경변수로 관리 권장)
// .env.local에 ADMIN_PASSWORD=your_password 추가
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "vhouse2026";

// 세션 스토리지 키
const AUTH_KEY = "vhouse_admin_auth";

/**
 * 관리자 로그인
 * @param password 입력된 비밀번호
 * @returns 로그인 성공 여부
 */
export function adminLogin(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    // 세션 스토리지에 인증 상태 저장
    if (typeof window !== "undefined") {
      sessionStorage.setItem(AUTH_KEY, "true");
    }
    return true;
  }
  return false;
}

/**
 * 관리자 로그아웃
 */
export function adminLogout(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(AUTH_KEY);
  }
}

/**
 * 관리자 인증 상태 확인
 * @returns 인증 여부
 */
export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return sessionStorage.getItem(AUTH_KEY) === "true";
}
