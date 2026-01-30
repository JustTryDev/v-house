"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

/**
 * 📌 Convex 클라이언트 Provider
 *
 * 이 컴포넌트는 "데이터베이스 연결선"과 같습니다.
 * 앱 전체에서 Convex 데이터베이스에 접근할 수 있게 해줍니다.
 *
 * 사용법:
 * - NEXT_PUBLIC_CONVEX_URL 환경 변수 필요
 * - 레이아웃에서 children을 감싸서 사용
 */

// Convex URL이 없으면 에러 (개발 환경에서 미리 알 수 있도록)
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

// Convex 클라이언트 인스턴스 생성
// convexUrl이 없으면 빈 문자열로 설정 (나중에 설정)
const convex = new ConvexReactClient(convexUrl || "");

interface ConvexClientProviderProps {
  children: ReactNode;
}

export function ConvexClientProvider({ children }: ConvexClientProviderProps) {
  // Convex URL이 설정되지 않았으면 경고만 표시하고 children 반환
  // (개발 초기에 Convex 없이도 UI 작업 가능)
  if (!convexUrl) {
    console.warn(
      "⚠️ NEXT_PUBLIC_CONVEX_URL이 설정되지 않았습니다. Convex 기능이 비활성화됩니다."
    );
    return <>{children}</>;
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
