"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "./DateRangePicker";
import { Users, Minus, Plus, CheckCircle } from "lucide-react";
import { differenceInDays } from "date-fns";
import { useExchangeRate } from "@/hooks";
import { formatKRW, convertToVND, formatVND } from "@/lib/price";

/**
 * 📌 예약 폼 컴포넌트
 *
 * 예약에 필요한 모든 정보를 입력받는 폼입니다.
 * 마치 호텔의 "예약 신청서"와 같습니다.
 *
 * 입력 정보:
 * 1. 체크인/체크아웃 날짜
 * 2. 인원 (성인, 어린이)
 * 3. 객실 선택
 * 4. 예약자 정보 (이름, 이메일, 전화번호, 국적)
 * 5. 특별 요청사항
 */

// 예약 폼 유효성 검사 스키마
const bookingSchema = z.object({
  guestName: z.string().min(2, "이름을 입력해주세요"),
  guestEmail: z.string().email("올바른 이메일을 입력해주세요"),
  guestPhone: z.string().min(10, "전화번호를 입력해주세요"),
  guestCountry: z.string().min(1, "국적을 선택해주세요"),
  specialRequests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

// 국가 목록
const countries = [
  { code: "VN", name: "Việt Nam", nameKo: "베트남", nameEn: "Vietnam" },
  { code: "KR", name: "Hàn Quốc", nameKo: "한국", nameEn: "South Korea" },
  { code: "US", name: "Mỹ", nameKo: "미국", nameEn: "United States" },
  { code: "JP", name: "Nhật Bản", nameKo: "일본", nameEn: "Japan" },
  { code: "CN", name: "Trung Quốc", nameKo: "중국", nameEn: "China" },
  { code: "OTHER", name: "Khác", nameKo: "기타", nameEn: "Other" },
];

interface Room {
  _id: Id<"rooms">;
  name: string;
  nameKo: string;
  nameEn: string;
  price: number;
  capacity: number;
}

interface BookingFormProps {
  rooms: Room[];
  locale: string;
}

export function BookingForm({ rooms, locale }: BookingFormProps) {
  const t = useTranslations("booking");
  const createReservation = useMutation(api.reservations.create);
  const { vndRate } = useExchangeRate();

  // 상태 관리
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<Id<"rooms"> | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 폼 설정
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  // 숙박 일수 계산
  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;

  // 선택된 객실 정보
  const selectedRoomData = rooms.find((r) => r._id === selectedRoom);

  // 총 금액 계산
  const totalPrice = selectedRoomData ? selectedRoomData.price * nights : 0;

  // 객실 이름 가져오기 (언어별)
  const getRoomName = (room: Room) => {
    if (locale === "ko") return room.nameKo;
    if (locale === "en") return room.nameEn;
    return room.name;
  };

  // 국가 이름 가져오기 (언어별)
  const getCountryName = (country: typeof countries[0]) => {
    if (locale === "ko") return country.nameKo;
    if (locale === "en") return country.nameEn;
    return country.name;
  };

  // 인원 변경 핸들러
  const handleAdultsChange = (delta: number) => {
    const newValue = adults + delta;
    if (newValue >= 1 && newValue <= 4) {
      setAdults(newValue);
    }
  };

  const handleChildrenChange = (delta: number) => {
    const newValue = children + delta;
    if (newValue >= 0 && newValue <= 3) {
      setChildren(newValue);
    }
  };

  // 폼 제출
  const onSubmit = async (data: BookingFormData) => {
    // 유효성 검사
    if (!checkIn || !checkOut) {
      toast.error("날짜를 선택해주세요");
      return;
    }
    if (!selectedRoom) {
      toast.error("객실을 선택해주세요");
      return;
    }

    setIsSubmitting(true);

    try {
      await createReservation({
        roomId: selectedRoom,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        guestCountry: data.guestCountry,
        checkIn: checkIn.toISOString().split("T")[0],
        checkOut: checkOut.toISOString().split("T")[0],
        adults,
        children,
        totalPrice,
        specialRequests: data.specialRequests || undefined,
      });

      setIsSuccess(true);
      toast.success(t("success.title"));
    } catch (error) {
      console.error("예약 실패:", error);
      toast.error("예약에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 성공 화면
  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 text-center max-w-md mx-auto"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t("success.title")}
        </h2>
        <p className="text-gray-600 mb-6">{t("success.message")}</p>
        <Button
          onClick={() => setIsSuccess(false)}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]"
        >
          새 예약하기
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 날짜 선택 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">
          {t("checkIn")} / {t("checkOut")}
        </h3>
        <DateRangePicker
          checkIn={checkIn}
          checkOut={checkOut}
          onDateChange={(ci, co) => {
            setCheckIn(ci);
            setCheckOut(co);
          }}
        />
      </div>

      {/* 인원 선택 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">{t("guests")}</h3>
        <div className="space-y-4">
          {/* 성인 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{t("adults")}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleAdultsChange(-1)}
                disabled={adults <= 1}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-semibold">{adults}</span>
              <button
                type="button"
                onClick={() => handleAdultsChange(1)}
                disabled={adults >= 4}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 어린이 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <span className="text-gray-700">{t("children")}</span>
                <span className="text-green-600 text-sm ml-2">
                  ({t("childrenFree")})
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleChildrenChange(-1)}
                disabled={children <= 0}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-semibold">{children}</span>
              <button
                type="button"
                onClick={() => handleChildrenChange(1)}
                disabled={children >= 3}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 객실 선택 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">{t("selectRoom")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rooms.map((room) => (
            <button
              key={room._id}
              type="button"
              onClick={() => setSelectedRoom(room._id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selectedRoom === room._id
                  ? "border-[var(--color-primary)] bg-orange-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <p className="font-semibold text-gray-900">{getRoomName(room)}</p>
              <p className="text-sm text-gray-500">
                {formatKRW(room.price)} / {t("nights").replace("đêm", "").trim() || "night"}
              </p>
              {vndRate && (
                <p className="text-xs text-gray-400">
                  ≈ {formatVND(convertToVND(room.price, vndRate))}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 예약자 정보 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">{t("guestInfo")}</h3>
        <div className="space-y-4">
          {/* 이름 */}
          <div>
            <Label htmlFor="guestName">{t("name")} *</Label>
            <Input
              id="guestName"
              {...register("guestName")}
              className="mt-1"
              placeholder="Nguyen Van A"
            />
            {errors.guestName && (
              <p className="text-red-500 text-sm mt-1">{errors.guestName.message}</p>
            )}
          </div>

          {/* 이메일 */}
          <div>
            <Label htmlFor="guestEmail">{t("email")} *</Label>
            <Input
              id="guestEmail"
              type="email"
              {...register("guestEmail")}
              className="mt-1"
              placeholder="example@email.com"
            />
            {errors.guestEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.guestEmail.message}</p>
            )}
          </div>

          {/* 전화번호 */}
          <div>
            <Label htmlFor="guestPhone">{t("phone")} *</Label>
            <Input
              id="guestPhone"
              {...register("guestPhone")}
              className="mt-1"
              placeholder="+84 123 456 789"
            />
            {errors.guestPhone && (
              <p className="text-red-500 text-sm mt-1">{errors.guestPhone.message}</p>
            )}
          </div>

          {/* 국적 */}
          <div>
            <Label htmlFor="guestCountry">{t("country")} *</Label>
            <Select onValueChange={(value) => setValue("guestCountry", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {getCountryName(country)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.guestCountry && (
              <p className="text-red-500 text-sm mt-1">{errors.guestCountry.message}</p>
            )}
          </div>

          {/* 특별 요청사항 */}
          <div>
            <Label htmlFor="specialRequests">{t("specialRequests")}</Label>
            <Textarea
              id="specialRequests"
              {...register("specialRequests")}
              className="mt-1"
              placeholder={t("specialRequestsPlaceholder")}
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* 총 금액 및 제출 버튼 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-600">{t("totalPrice")}</span>
          <div className="text-right">
            {nights > 0 && selectedRoomData && (
              <p className="text-sm text-gray-500 mb-1">
                {formatKRW(selectedRoomData.price)} x {nights} {t("nights")}
              </p>
            )}
            <p className="text-2xl font-bold text-[var(--color-primary)]">
              {formatKRW(totalPrice)}
            </p>
            {vndRate && totalPrice > 0 && (
              <p className="text-sm text-gray-500">
                ≈ {formatVND(convertToVND(totalPrice, vndRate))}
              </p>
            )}
          </div>
        </div>
        <Button
          type="submit"
          disabled={isSubmitting || !checkIn || !checkOut || !selectedRoom}
          className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white py-6 text-lg font-semibold"
        >
          {isSubmitting ? "처리중..." : t("submit")}
        </Button>
      </div>
    </form>
  );
}
