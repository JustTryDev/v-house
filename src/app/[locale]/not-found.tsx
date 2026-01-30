"use client";

import { Link } from "@/i18n/navigation";
import { Home, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

/**
 * 📌 404 페이지
 *
 * 존재하지 않는 페이지에 접근했을 때 보여주는 페이지입니다.
 * 마치 "길을 잃었을 때 안내판"처럼 사용자를 올바른 곳으로 안내합니다.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* 404 숫자 */}
        <div className="text-8xl font-bold text-[var(--color-primary)] mb-4">
          404
        </div>

        {/* 메시지 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-gray-600 mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>

        {/* 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <Home size={20} />
            홈으로 가기
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            이전 페이지
          </button>
        </div>
      </motion.div>
    </div>
  );
}
