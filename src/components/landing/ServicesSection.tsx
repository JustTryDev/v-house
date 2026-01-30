"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  WashingMachine,
  Coffee,
  Car,
  ChefHat,
  Wifi,
  Monitor,
  Smartphone,
  CreditCard,
} from "lucide-react";

/**
 * 📌 무료 서비스 섹션
 *
 * V-HOUSE에서 제공하는 8가지 무료 서비스를 소개합니다.
 * 마치 호텔의 "편의시설 안내판"처럼 한눈에 볼 수 있게 정리했습니다.
 *
 * 무료 서비스:
 * 1. 세탁/건조
 * 2. 가벼운 아침
 * 3. 무료 주차
 * 4. 주방 사용
 * 5. 고속 와이파이
 * 6. PC/프린트/스캔
 * 7. USIM 등록 지원
 * 8. 교통카드 충전
 */

// 서비스 목록 정의
const services = [
  { key: "laundry", icon: WashingMachine },
  { key: "breakfast", icon: Coffee },
  { key: "parking", icon: Car },
  { key: "kitchen", icon: ChefHat },
  { key: "wifi", icon: Wifi },
  { key: "pc", icon: Monitor },
  { key: "usim", icon: Smartphone },
  { key: "transport", icon: CreditCard },
];

export function ServicesSection() {
  const t = useTranslations("services");

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* 서비스 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={service.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-orange-50 transition-colors group"
              >
                {/* 아이콘 */}
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-colors">
                  <Icon
                    size={24}
                    className="text-gray-600 group-hover:text-white transition-colors"
                  />
                </div>

                {/* 서비스명 */}
                <h3 className="font-semibold text-gray-900 mb-1">
                  {t(`items.${service.key}.title`)}
                </h3>

                {/* 설명 */}
                <p className="text-sm text-gray-500">
                  {t(`items.${service.key}.description`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
