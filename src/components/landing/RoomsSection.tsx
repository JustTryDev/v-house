"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Users, Bed } from "lucide-react";
import { useExchangeRate } from "@/hooks";
import { formatKRW, convertToVND, formatVND } from "@/lib/price";

/**
 * 📌 객실 섹션
 *
 * 6개의 객실을 미리보기 형태로 보여줍니다.
 * 마치 부동산 웹사이트의 "매물 목록"처럼 핵심 정보를 요약합니다.
 *
 * 각 객실 카드에 표시되는 정보:
 * - 객실 이미지
 * - 객실 이름 (베트남어 의미있는 이름)
 * - 가격
 * - 수용 인원
 * - 침대 타입
 */

// 객실 목록 정의 (나중에 Convex에서 가져올 데이터)
const rooms = [
  {
    key: "happiness",
    image: "/images/room-happiness-1.jpg",
    price: 50000,
    capacity: 4,
  },
  {
    key: "peace",
    image: "/images/room-peace-1.jpg",
    price: 50000,
    capacity: 4,
  },
  {
    key: "warmth",
    image: "/images/room-warmth-1.jpg",
    price: 50000,
    capacity: 4,
  },
  {
    key: "serenity",
    image: "/images/room-serenity-1.jpg",
    price: 50000,
    capacity: 4,
  },
  {
    key: "relax",
    image: "/images/room-serenity-2.jpg", // 세레니티 2번 이미지 사용
    price: 50000,
    capacity: 4,
  },
  {
    key: "love",
    image: "/images/room-warmth-2.jpg", // 따뜻함 2번 이미지 사용
    price: 50000,
    capacity: 4,
  },
];

export function RoomsSection() {
  const t = useTranslations("rooms");
  const { vndRate } = useExchangeRate();

  return (
    <section id="rooms" className="py-20 bg-gray-50">
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

        {/* 객실 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room, index) => (
            <motion.div
              key={room.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              {/* 객실 이미지 */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={room.image}
                  alt={t(`names.${room.key}`)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* 가격 뱃지 */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl">
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-[var(--color-primary)]">
                      {formatKRW(room.price)}
                      <span className="text-gray-500 text-sm font-normal">/{t("price")}</span>
                    </span>
                    {vndRate && (
                      <span className="text-xs text-gray-500">
                        ≈ {formatVND(convertToVND(room.price, vndRate))}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 객실 정보 */}
              <div className="p-5">
                {/* 객실 이름 */}
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {t(`names.${room.key}`)}
                </h3>

                {/* 상세 정보 */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Users size={16} />
                    <span>{t("capacity", { count: room.capacity })}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bed size={16} />
                    <span>{t("bed")}</span>
                  </div>
                </div>

                {/* CTA 버튼 */}
                <Link
                  href="/booking"
                  className="block w-full text-center bg-gray-100 hover:bg-[var(--color-primary)] text-gray-700 hover:text-white py-2.5 rounded-lg font-medium transition-colors"
                >
                  {t("bookNow")}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
