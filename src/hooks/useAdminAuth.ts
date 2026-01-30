"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAdminAuthenticated, adminLogin, adminLogout } from "@/lib/adminAuth";

/**
 * 📌 관리자 인증 훅
 *
 * 관리자 페이지에서 인증 상태를 관리하는 커스텀 훅입니다.
 * 마치 "출입증 확인 시스템"처럼 인증된 사용자만 접근을 허용합니다.
 *
 * 기능:
 * - 인증 상태 확인
 * - 로그인 처리
 * - 로그아웃 처리
 * - 미인증시 로그인 페이지로 리다이렉트
 */
export function useAdminAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트 마운트시 인증 상태 확인
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAdminAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // 로그인 함수
  const login = (password: string): boolean => {
    const success = adminLogin(password);
    if (success) {
      setIsAuthenticated(true);
    }
    return success;
  };

  // 로그아웃 함수
  const logout = () => {
    adminLogout();
    setIsAuthenticated(false);
    router.push("/admin");
  };

  // 인증 필요 - 미인증시 로그인 페이지로 이동
  const requireAuth = () => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin");
    }
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    requireAuth,
  };
}
