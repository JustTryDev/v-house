"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format, differenceInDays, addDays } from "date-fns";
import { vi, ko, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";
import { DateRange } from "react-day-picker";

/**
 * 📌 날짜 범위 선택 컴포넌트
 *
 * 체크인/체크아웃 날짜를 선택하는 컴포넌트입니다.
 * 마치 여행사의 "출발일/귀국일 선택"과 같습니다.
 *
 * 기능:
 * - 체크인 날짜 선택 (오늘 이후만)
 * - 체크아웃 날짜 선택 (체크인 다음날 이후)
 * - 숙박 일수 자동 계산
 */

interface DateRangePickerProps {
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  onDateChange: (checkIn: Date | undefined, checkOut: Date | undefined) => void;
}

// 언어별 로케일 매핑
const localeMap = {
  vi: vi,
  ko: ko,
  en: enUS,
};

export function DateRangePicker({
  checkIn,
  checkOut,
  onDateChange,
}: DateRangePickerProps) {
  const t = useTranslations("booking");
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  // 날짜 로케일 설정
  const dateLocale = localeMap[locale as keyof typeof localeMap] || enUS;

  // 오늘 날짜 (과거 선택 방지)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 숙박 일수 계산
  const nights =
    checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;

  // 날짜 범위 변경 핸들러
  const handleSelect = (range: DateRange | undefined) => {
    if (range) {
      onDateChange(range.from, range.to);
      // 체크인과 체크아웃 모두 선택되면 팝오버 닫기
      if (range.from && range.to) {
        setIsOpen(false);
      }
    }
  };

  // 날짜 포맷
  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, "yyyy.MM.dd (EEE)", { locale: dateLocale });
  };

  return (
    <div className="space-y-4">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal h-auto py-4"
          >
            <CalendarIcon className="mr-3 h-5 w-5 text-gray-400" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              {/* 체크인 */}
              <div>
                <span className="text-xs text-gray-500 block">{t("checkIn")}</span>
                <span className={checkIn ? "text-gray-900" : "text-gray-400"}>
                  {checkIn ? formatDate(checkIn) : "날짜 선택"}
                </span>
              </div>
              <span className="hidden sm:block text-gray-300">→</span>
              {/* 체크아웃 */}
              <div>
                <span className="text-xs text-gray-500 block">{t("checkOut")}</span>
                <span className={checkOut ? "text-gray-900" : "text-gray-400"}>
                  {checkOut ? formatDate(checkOut) : "날짜 선택"}
                </span>
              </div>
              {/* 숙박 일수 */}
              {nights > 0 && (
                <span className="text-[var(--color-primary)] font-semibold">
                  ({nights} {t("nights")})
                </span>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={{ from: checkIn, to: checkOut }}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={(date) => date < today}
            locale={dateLocale}
            className="rounded-lg"
          />
          {/* 체크인/체크아웃 시간 안내 */}
          <div className="p-3 border-t text-sm text-gray-500 flex justify-between">
            <span>{t("checkInTime")}</span>
            <span>{t("checkOutTime")}</span>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
