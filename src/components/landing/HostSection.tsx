"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

/**
 * 📌 호스트 소개 섹션
 *
 * V-HOUSE 호스트(쭈니)를 소개하는 섹션입니다.
 * 마치 "인터뷰 기사"처럼 호스트의 이야기를 전달합니다.
 *
 * 목적:
 * - 신뢰감 형성 (베트남인 호스트)
 * - 감성적 연결 (스토리텔링)
 * - 베트남어 소통 가능함을 강조
 */
export function HostSection() {
  const t = useTranslations("host");

  return (
    <section className="py-20 bg-orange-50">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-sm"
        >
          {/* 섹션 제목 */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
            {t("title")}
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* 호스트 이미지 (플레이스홀더) */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
                <span className="text-6xl">👩</span>
              </div>
            </div>

            {/* 호스트 정보 */}
            <div className="flex-1 text-center md:text-left">
              {/* 이름 */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t("name")}
              </h3>

              {/* 인사말 */}
              <p className="text-[var(--color-primary)] font-medium mb-4">
                {t("greeting")}
              </p>

              {/* 스토리 */}
              <div className="relative">
                <Quote
                  size={24}
                  className="absolute -top-2 -left-2 text-orange-200"
                />
                <p className="text-gray-600 leading-relaxed whitespace-pre-line pl-6">
                  {t("story")}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
