"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { RefreshCcw, Home, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

/**
 * 📌 에러 페이지
 *
 * 예기치 않은 오류가 발생했을 때 보여주는 페이지입니다.
 * 마치 "고장 안내문"처럼 사용자에게 상황을 알리고 해결 방법을 제시합니다.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러 로깅 (프로덕션에서는 Sentry 등 사용 권장)
    console.error("페이지 에러:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* 아이콘 */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </div>

        {/* 메시지 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          문제가 발생했습니다
        </h1>
        <p className="text-gray-600 mb-8">
          죄송합니다. 예기치 않은 오류가 발생했습니다.
          <br />
          잠시 후 다시 시도해주세요.
        </p>

        {/* 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <RefreshCcw size={20} />
            다시 시도
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <Home size={20} />
            홈으로 가기
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
