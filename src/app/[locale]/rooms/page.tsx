"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Bed, Wifi, Wind, Tv, Refrigerator, Bath } from "lucide-react";

/**
 * 📌 객실 목록 페이지
 *
 * 모든 객실을 상세하게 보여주는 페이지입니다.
 * 마치 부동산의 "매물 상세 목록"과 같습니다.
 *
 * 각 객실 카드에 표시:
 * - 여러 장의 이미지
 * - 객실 이름 및 설명
 * - 가격, 수용 인원
 * - 편의시설 목록
 * - 예약 버튼
 */

// 편의시설 아이콘 매핑
const amenityIcons: Record<string, { icon: typeof Wifi; label: string }> = {
  wifi: { icon: Wifi, label: "Wifi" },
  ac: { icon: Wind, label: "에어컨" },
  tv: { icon: Tv, label: "TV" },
  fridge: { icon: Refrigerator, label: "냉장고" },
  private_bathroom: { icon: Bath, label: "개인 욕실" },
};

export default function RoomsPage() {
  const t = useTranslations("rooms");
  const locale = useLocale();

  // Convex에서 객실 목록 가져오기
  const rooms = useQuery(api.rooms.list);

  // 객실 이름 가져오기 (언어별)
  const getRoomName = (room: NonNullable<typeof rooms>[0]) => {
    if (locale === "ko") return room.nameKo;
    if (locale === "en") return room.nameEn;
    return room.name;
  };

  // 객실 설명 가져오기 (언어별)
  const getRoomDescription = (room: NonNullable<typeof rooms>[0]) => {
    if (locale === "ko") return room.description.ko;
    if (locale === "en") return room.description.en;
    return room.description.vi;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* 페이지 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* 객실 목록 */}
        {rooms === undefined ? (
          // 로딩 상태
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-72 w-full rounded-2xl" />
            ))}
          </div>
        ) : rooms.length === 0 ? (
          // 객실 없음
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-gray-600">현재 등록된 객실이 없습니다.</p>
          </div>
        ) : (
          // 객실 카드 목록
          <div className="space-y-8">
            {rooms.map((room, index) => (
              <motion.div
                key={room._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  {/* 이미지 영역 */}
                  <div className="md:w-2/5 relative h-64 md:h-auto">
                    <Image
                      src={room.images[0] || "/images/room-happiness-1.jpg"}
                      alt={getRoomName(room)}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                    {/* 가격 뱃지 */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="font-bold text-[var(--color-primary)] text-lg">
                        ₩{room.price.toLocaleString()}
                      </span>
                      <span className="text-gray-500">/{t("price")}</span>
                    </div>
                  </div>

                  {/* 정보 영역 */}
                  <div className="md:w-3/5 p-6 flex flex-col">
                    {/* 객실 이름 */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {getRoomName(room)}
                    </h2>

                    {/* 객실 설명 */}
                    <p className="text-gray-600 mb-4 flex-grow">
                      {getRoomDescription(room)}
                    </p>

                    {/* 기본 정보 */}
                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <Users size={18} />
                        <span>{t("capacity", { count: room.capacity })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bed size={18} />
                        <span>{t("bed")}</span>
                      </div>
                    </div>

                    {/* 편의시설 */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {room.amenities.map((amenity) => {
                        const amenityData = amenityIcons[amenity];
                        if (!amenityData) return null;
                        const Icon = amenityData.icon;
                        return (
                          <span
                            key={amenity}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-600"
                          >
                            <Icon size={14} />
                            {amenityData.label}
                          </span>
                        );
                      })}
                    </div>

                    {/* 예약 버튼 */}
                    <Link
                      href="/booking"
                      className="inline-flex items-center justify-center bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white py-3 px-6 rounded-xl font-semibold transition-colors"
                    >
                      {t("bookNow")}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
