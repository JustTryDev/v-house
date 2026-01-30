import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * 📌 객실 API
 *
 * 객실 정보를 조회하고 관리하는 API입니다.
 * 마치 호텔의 "객실 안내 데스크"와 같은 역할입니다.
 */

/**
 * 모든 객실 목록 조회 (사용자용)
 * - 예약 가능한 객실만 조회 (isAvailable: true)
 * - order 순서대로 정렬
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const rooms = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("isAvailable"), true))
      .collect();

    // order 필드로 정렬
    return rooms.sort((a, b) => a.order - b.order);
  },
});

/**
 * 모든 객실 목록 조회 (관리자용)
 * - 비활성화된 객실도 포함하여 모두 조회
 * - order 순서대로 정렬
 *
 * 📌 사용 시점:
 * - 관리자 페이지에서 객실 관리할 때
 * - 비활성화된 객실을 다시 활성화해야 할 때
 */
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const rooms = await ctx.db.query("rooms").collect();

    // order 필드로 정렬
    return rooms.sort((a, b) => a.order - b.order);
  },
});

/**
 * 특정 객실 상세 조회
 * - 객실 ID로 조회
 */
export const getById = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.roomId);
  },
});

/**
 * 특정 날짜에 예약 가능한 객실 조회
 * - 해당 날짜 범위에 예약이 없는 객실만 반환
 */
export const getAvailableRooms = query({
  args: {
    checkIn: v.string(), // "2026-02-15"
    checkOut: v.string(), // "2026-02-17"
  },
  handler: async (ctx, args) => {
    // 1. 모든 활성 객실 가져오기
    const allRooms = await ctx.db
      .query("rooms")
      .filter((q) => q.eq(q.field("isAvailable"), true))
      .collect();

    // 2. 해당 기간에 예약된 객실 ID 찾기
    const reservations = await ctx.db.query("reservations").collect();

    // 예약이 겹치는지 확인하는 함수
    const isOverlapping = (
      resCheckIn: string,
      resCheckOut: string,
      checkIn: string,
      checkOut: string
    ) => {
      // 예약이 겹치는 조건: 시작일 < 종료일 AND 종료일 > 시작일
      return resCheckIn < checkOut && resCheckOut > checkIn;
    };

    // 해당 기간에 예약된 객실 ID 목록
    const bookedRoomIds = reservations
      .filter(
        (res) =>
          (res.status === "pending" || res.status === "confirmed") &&
          isOverlapping(res.checkIn, res.checkOut, args.checkIn, args.checkOut)
      )
      .map((res) => res.roomId.toString());

    // 3. 차단된 날짜 확인
    const blockedDates = await ctx.db.query("blockedDates").collect();

    // 체크인~체크아웃 사이의 모든 날짜 생성
    const getDatesInRange = (start: string, end: string) => {
      const dates = [];
      const current = new Date(start);
      const endDate = new Date(end);
      while (current < endDate) {
        dates.push(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }
      return dates;
    };

    const requestedDates = getDatesInRange(args.checkIn, args.checkOut);

    // 차단된 객실 ID 목록
    const blockedRoomIds = blockedDates
      .filter((blocked) => requestedDates.includes(blocked.date))
      .map((blocked) => blocked.roomId.toString());

    // 4. 예약되지 않고 차단되지 않은 객실만 반환
    const availableRooms = allRooms.filter(
      (room) =>
        !bookedRoomIds.includes(room._id.toString()) &&
        !blockedRoomIds.includes(room._id.toString())
    );

    return availableRooms.sort((a, b) => a.order - b.order);
  },
});

/**
 * 객실 생성 (관리자용)
 * - 새 객실 추가
 */
export const create = mutation({
  args: {
    name: v.string(),
    nameKo: v.string(),
    nameEn: v.string(),
    description: v.object({
      vi: v.string(),
      ko: v.string(),
      en: v.string(),
    }),
    price: v.number(),
    capacity: v.number(),
    bedType: v.string(),
    amenities: v.array(v.string()),
    images: v.array(v.string()),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("rooms", {
      ...args,
      isAvailable: true,
    });
  },
});

/**
 * 객실 정보 수정 (관리자용)
 */
export const update = mutation({
  args: {
    roomId: v.id("rooms"),
    name: v.optional(v.string()),
    nameKo: v.optional(v.string()),
    nameEn: v.optional(v.string()),
    description: v.optional(
      v.object({
        vi: v.string(),
        ko: v.string(),
        en: v.string(),
      })
    ),
    price: v.optional(v.number()),
    capacity: v.optional(v.number()),
    bedType: v.optional(v.string()),
    amenities: v.optional(v.array(v.string())),
    images: v.optional(v.array(v.string())),
    isAvailable: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { roomId, ...updates } = args;

    // undefined 값 제거
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined)
    );

    await ctx.db.patch(roomId, cleanUpdates);
    return roomId;
  },
});

/**
 * 초기 객실 데이터 시드 (개발용)
 * - 6개 객실 한번에 생성
 */
export const seedRooms = mutation({
  args: {},
  handler: async (ctx) => {
    // 이미 데이터가 있으면 건너뛰기
    const existingRooms = await ctx.db.query("rooms").collect();
    if (existingRooms.length > 0) {
      return { message: "이미 객실 데이터가 있습니다.", count: existingRooms.length };
    }

    const roomsData = [
      {
        name: "Phòng Hạnh Phúc",
        nameKo: "행복의 방",
        nameEn: "Happiness Room",
        description: {
          vi: "Phòng ấm cúng với tông màu be, mang đến cảm giác thoải mái như ở nhà.",
          ko: "베이지 톤의 아늑한 방으로, 집 같은 편안함을 선사합니다.",
          en: "A cozy room with beige tones, offering a comfortable home-like feeling.",
        },
        price: 50000,
        capacity: 4,
        bedType: "king",
        amenities: ["wifi", "ac", "tv", "fridge", "private_bathroom"],
        images: ["/images/room-happiness-1.jpg", "/images/room-happiness-2.jpg"],
        isAvailable: true,
        order: 1,
      },
      {
        name: "Phòng Bình Yên",
        nameKo: "평화의 방",
        nameEn: "Peace Room",
        description: {
          vi: "Phòng với tông màu trắng tinh khiết, thiết kế đơn giản và thanh lịch.",
          ko: "순백의 화이트 톤으로 심플하고 우아한 디자인의 방입니다.",
          en: "A room with pure white tones, featuring simple and elegant design.",
        },
        price: 50000,
        capacity: 4,
        bedType: "king",
        amenities: ["wifi", "ac", "tv", "fridge", "private_bathroom"],
        images: ["/images/room-peace-1.jpg"],
        isAvailable: true,
        order: 2,
      },
      {
        name: "Phòng Ấm Áp",
        nameKo: "따뜻한 방",
        nameEn: "Warmth Room",
        description: {
          vi: "Phòng có giấy dán tường điểm nhấn và giường có ngăn chứa đồ tiện lợi.",
          ko: "포인트 벽지와 수납 침대가 있는 실용적인 방입니다.",
          en: "A practical room with accent wallpaper and storage bed.",
        },
        price: 50000,
        capacity: 4,
        bedType: "king",
        amenities: ["wifi", "ac", "tv", "fridge", "private_bathroom"],
        images: ["/images/room-warmth-1.jpg", "/images/room-warmth-2.jpg"],
        isAvailable: true,
        order: 3,
      },
      {
        name: "Phòng An Lành",
        nameKo: "평안의 방",
        nameEn: "Serenity Room",
        description: {
          vi: "Phòng rộng rãi với đầy đủ tiện nghi, TV màn hình lớn.",
          ko: "넓은 공간에 TV가 완비된 여유로운 방입니다.",
          en: "A spacious room fully equipped with a large TV.",
        },
        price: 50000,
        capacity: 4,
        bedType: "king",
        amenities: ["wifi", "ac", "tv", "fridge", "private_bathroom"],
        images: ["/images/room-serenity-1.jpg", "/images/room-serenity-2.jpg"],
        isAvailable: true,
        order: 4,
      },
      {
        name: "Phòng Thư Giãn",
        nameKo: "휴식의 방",
        nameEn: "Relax Room",
        description: {
          vi: "Phòng ấm cúng hoàn hảo để thư giãn sau một ngày dài.",
          ko: "긴 하루 후 휴식하기에 완벽한 아늑한 방입니다.",
          en: "A cozy room perfect for relaxing after a long day.",
        },
        price: 50000,
        capacity: 4,
        bedType: "king",
        amenities: ["wifi", "ac", "tv", "fridge", "private_bathroom"],
        images: ["/images/room-serenity-2.jpg"],
        isAvailable: true,
        order: 5,
      },
      {
        name: "Phòng Yêu Thương",
        nameKo: "사랑의 방",
        nameEn: "Love Room",
        description: {
          vi: "Phòng lý tưởng cho các cặp đôi và gia đình nhỏ.",
          ko: "커플과 소규모 가족에게 이상적인 방입니다.",
          en: "An ideal room for couples and small families.",
        },
        price: 50000,
        capacity: 4,
        bedType: "king",
        amenities: ["wifi", "ac", "tv", "fridge", "private_bathroom"],
        images: ["/images/room-warmth-2.jpg"],
        isAvailable: true,
        order: 6,
      },
    ];

    // 모든 객실 생성
    for (const room of roomsData) {
      await ctx.db.insert("rooms", room);
    }

    return { message: "객실 데이터가 생성되었습니다.", count: roomsData.length };
  },
});
