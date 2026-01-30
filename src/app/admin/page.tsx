"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

/**
 * 📌 관리자 로그인 페이지
 *
 * 관리자가 비밀번호를 입력하여 로그인하는 페이지입니다.
 * 마치 "금고 비밀번호 입력"처럼 인증된 사용자만 관리 기능에 접근할 수 있습니다.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, login } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 이미 로그인된 경우 대시보드로 이동
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  // 로그인 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // 약간의 딜레이 (UX 개선)
    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = login(password);

    if (success) {
      router.push("/admin/dashboard");
    } else {
      setError("비밀번호가 올바르지 않습니다.");
      setPassword("");
    }

    setIsSubmitting(false);
  };

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* 로고 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">
            V-HOUSE
          </h1>
          <p className="text-gray-400 mt-2">관리자 로그인</p>
        </div>

        {/* 로그인 폼 */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-8 shadow-xl"
        >
          {/* 아이콘 */}
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-gray-600" />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* 비밀번호 입력 */}
          <div className="space-y-2 mb-6">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="관리자 비밀번호 입력"
              className="h-12"
              autoFocus
            />
          </div>

          {/* 로그인 버튼 */}
          <Button
            type="submit"
            disabled={isSubmitting || !password}
            className="w-full h-12 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold"
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
          </Button>

          {/* 힌트 */}
          <p className="text-center text-gray-400 text-sm mt-4">
            기본 비밀번호: vhouse2026
          </p>
        </form>

        {/* 돌아가기 */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← 웹사이트로 돌아가기
          </a>
        </div>
      </motion.div>
    </div>
  );
}
