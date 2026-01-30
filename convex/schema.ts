import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * 📌 V-HOUSE 데이터베이스 스키마
 *
 * Convex 스키마는 "서류 양식"과 같습니다.
 * 어떤 정보를 어떤 형식으로 저장할지 미리 정해두는 것이죠.
 *
 * 테이블(Table) = 서랍장의 서랍
 * - rooms: 객실 정보 서랍
 * - reservations: 예약 정보 서랍
 * - blockedDates: 예약 불가 날짜 서랍
 * - inquiries: 문의 내용 서랍
 */
export default defineSchema({
  /**
   * 🏠 객실 테이블 (rooms)
   * 6개의 객실 정보를 저장합니다
   */
  rooms: defineTable({
    // 방 이름 (베트남어) - 예: "Phòng Hạnh Phúc"
    name: v.string(),
    // 방 이름 (한국어) - 예: "행복의 방"
    nameKo: v.string(),
    // 방 이름 (영어) - 예: "Happiness Room"
    nameEn: v.string(),
    // 다국어 설명
    description: v.object({
      vi: v.string(), // 베트남어 설명
      ko: v.string(), // 한국어 설명
      en: v.string(), // 영어 설명
    }),
    // 1박 가격 (원) - 모두 50,000원
    price: v.number(),
    // 최대 수용 인원 - 4명
    capacity: v.number(),
    // 침대 타입 - "king"
    bedType: v.string(),
    // 편의시설 목록 - ["wifi", "ac", "tv", "fridge"]
    amenities: v.array(v.string()),
    // 객실 이미지 URL 배열
    images: v.array(v.string()),
    // 예약 가능 여부
    isAvailable: v.boolean(),
    // 목록 표시 순서
    order: v.number(),
  }),

  /**
   * 📅 예약 테이블 (reservations)
   * 고객의 예약 정보를 저장합니다
   */
  reservations: defineTable({
    // 예약한 객실 ID (rooms 테이블 참조)
    roomId: v.id("rooms"),
    // 예약자 이름
    guestName: v.string(),
    // 예약자 이메일
    guestEmail: v.string(),
    // 예약자 전화번호
    guestPhone: v.string(),
    // 예약자 국적
    guestCountry: v.string(),
    // 체크인 날짜 (YYYY-MM-DD 형식)
    checkIn: v.string(),
    // 체크아웃 날짜 (YYYY-MM-DD 형식)
    checkOut: v.string(),
    // 성인 수
    adults: v.number(),
    // 어린이 수 (12세 이하, 무료)
    children: v.number(),
    // 총 금액
    totalPrice: v.number(),
    // 예약 상태
    // - pending: 예약 신청됨 (대기중)
    // - confirmed: 관리자 확정
    // - cancelled: 취소됨
    // - completed: 숙박 완료
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("completed")
    ),
    // 특별 요청사항 (선택)
    specialRequests: v.optional(v.string()),
    // 생성 시간 (타임스탬프)
    createdAt: v.number(),
    // 수정 시간 (타임스탬프)
    updatedAt: v.number(),
  })
    // 인덱스: 상태별로 빠르게 조회
    .index("by_status", ["status"])
    // 인덱스: 객실별로 빠르게 조회
    .index("by_room", ["roomId"])
    // 인덱스: 체크인 날짜별로 빠르게 조회
    .index("by_checkIn", ["checkIn"]),

  /**
   * 🚫 예약 불가 날짜 테이블 (blockedDates)
   * 관리자가 특정 날짜를 예약 불가로 설정할 때 사용
   */
  blockedDates: defineTable({
    // 객실 ID
    roomId: v.id("rooms"),
    // 차단 날짜 (YYYY-MM-DD 형식)
    date: v.string(),
    // 차단 사유 (선택)
    reason: v.optional(v.string()),
  })
    // 인덱스: 객실+날짜로 빠르게 조회
    .index("by_room_date", ["roomId", "date"]),

  /**
   * 💬 문의 테이블 (inquiries)
   * 웹사이트를 통한 문의 내용 저장
   */
  inquiries: defineTable({
    // 문의자 이름
    name: v.string(),
    // 문의자 이메일
    email: v.string(),
    // 문의자 전화번호 (선택)
    phone: v.optional(v.string()),
    // 문의 제목
    subject: v.string(),
    // 문의 내용
    message: v.string(),
    // 문의 채널 (web, zalo, facebook 등)
    channel: v.string(),
    // 문의 상태
    // - unread: 읽지 않음
    // - read: 읽음
    // - replied: 답변 완료
    status: v.union(
      v.literal("unread"),
      v.literal("read"),
      v.literal("replied")
    ),
    // 생성 시간
    createdAt: v.number(),
  })
    // 인덱스: 상태별로 빠르게 조회
    .index("by_status", ["status"]),
});
