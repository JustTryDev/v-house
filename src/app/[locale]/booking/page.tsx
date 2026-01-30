"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { BookingForm } from "@/components/booking";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * 📌 예약 페이지
 *
 * 고객이 객실을 예약하는 페이지입니다.
 * 마치 여행사의 "예약 신청서"와 같습니다.
 *
 * 플로우:
 * 1. 날짜 선택 (체크인/체크아웃)
 * 2. 인원 입력 (성인, 어린이)
 * 3. 객실 선택
 * 4. 예약자 정보 입력
 * 5. 예약 신청
 */
export default function BookingPage() {
  const t = useTranslations("booking");
  const locale = useLocale();

  // Convex에서 객실 목록 가져오기
  const rooms = useQuery(api.rooms.list);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        {/* 페이지 제목 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("title")}
          </h1>
          <p className="text-gray-600">
            {t("checkInTime")} | {t("checkOutTime")}
          </p>
        </div>

        {/* 예약 폼 */}
        {rooms === undefined ? (
          // 로딩 상태
          <div className="space-y-6">
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-60 w-full rounded-2xl" />
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        ) : rooms.length === 0 ? (
          // 객실 없음
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-gray-600">현재 예약 가능한 객실이 없습니다.</p>
          </div>
        ) : (
          // 예약 폼
          <BookingForm rooms={rooms} locale={locale} />
        )}
      </div>
    </div>
  );
}
