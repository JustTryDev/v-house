"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Plane, MessageCircle, Wallet } from "lucide-react";

/**
 * 📌 핵심 장점 섹션
 *
 * V-HOUSE만의 3가지 핵심 장점을 강조합니다.
 * 마치 상품의 "핵심 셀링 포인트"처럼 방문자의 관심을 끕니다.
 *
 * 3가지 장점:
 * 1. 인천공항 15분 거리
 * 2. 베트남인 호스트 (베트남어 소통)
 * 3. 합리적인 가격
 */

// 장점 목록 정의
const features = [
  {
    key: "airport",
    icon: Plane,
    color: "bg-blue-100 text-blue-600",
  },
  {
    key: "vietnamese",
    icon: MessageCircle,
    color: "bg-orange-100 text-orange-600",
  },
  {
    key: "price",
    icon: Wallet,
    color: "bg-green-100 text-green-600",
  },
];

export function FeaturesSection() {
  const t = useTranslations("features");

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* 장점 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* 아이콘 */}
                <div
                  className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6`}
                >
                  <Icon size={28} />
                </div>

                {/* 제목 */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {t(`${feature.key}.title`)}
                </h3>

                {/* 설명 */}
                <p className="text-gray-600 leading-relaxed">
                  {t(`${feature.key}.description`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
