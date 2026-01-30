"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { MapPin, Car, Bus, Store, ShoppingCart } from "lucide-react";

/**
 * 📌 위치 섹션
 *
 * V-HOUSE의 위치와 교통 정보를 보여줍니다.
 * 마치 네비게이션 앱의 "목적지 정보"처럼 찾아오는 방법을 안내합니다.
 *
 * 표시 정보:
 * - 구글 지도 임베드
 * - 주소
 * - 공항에서 오는 방법 (택시, 버스)
 * - 주변 편의시설
 */

// 위치 정보 (하드코딩 방지)
const LOCATION = {
  address: "인천광역시 중구 운서동 3060-35",
  googleMapsUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.5!2d126.495!3d37.495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDI5JzQyLjAiTiAxMjbCsDI5JzQyLjAiRQ!5e0!3m2!1sen!2skr!4v1234567890",
  lat: 37.495,
  lng: 126.495,
};

export function LocationSection() {
  const t = useTranslations("location");

  return (
    <section id="location" className="py-20 bg-white">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 지도 영역 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gray-100 rounded-2xl overflow-hidden h-[400px]"
          >
            {/* 구글 맵 임베드 (실제 URL로 교체 필요) */}
            <iframe
              src={LOCATION.googleMapsUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="V-HOUSE Location"
            />
          </motion.div>

          {/* 정보 영역 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            {/* 주소 */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    {t("address")}
                  </h3>
                  <p className="text-gray-600">{LOCATION.address}</p>
                </div>
              </div>
            </div>

            {/* 공항에서 오는 방법 */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">
                {t("fromAirport")}
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Car size={20} className="text-blue-600" />
                  </div>
                  <span className="text-gray-700">{t("byTaxi")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Bus size={20} className="text-green-600" />
                  </div>
                  <span className="text-gray-700">{t("byBus")}</span>
                </div>
              </div>
            </div>

            {/* 주변 편의시설 */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">{t("nearby")}</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Store size={20} className="text-orange-600" />
                  </div>
                  <span className="text-gray-700">{t("convenience")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <ShoppingCart size={20} className="text-purple-600" />
                  </div>
                  <span className="text-gray-700">{t("mart")}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
