import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * 📌 다국어 네비게이션 유틸리티
 *
 * 이 파일은 "다국어 GPS" 같은 역할을 합니다.
 * 현재 언어에 맞는 링크를 자동으로 생성해줍니다.
 *
 * 예: 현재 베트남어(/vi)에서 객실 페이지 링크
 *     → Link 컴포넌트가 자동으로 /vi/rooms 로 이동
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
