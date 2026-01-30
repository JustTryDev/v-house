import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * 📌 예약 API
 *
 * 예약 생성, 조회, 관리를 담당하는 API입니다.
 * 마치 호텔의 "예약 접수 창구"와 같은 역할입니다.
 */

/**
 * 새 예약 생성
 * - 고객이 예약 신청할 때 사용
 * - 기본 상태: pending (대기중)
 */
export const create = mutation({
  args: {
    roomId: v.id("rooms"),
    guestName: v.string(),
    guestEmail: v.string(),
    guestPhone: v.string(),
    guestCountry: v.string(),
    checkIn: v.string(),
    checkOut: v.string(),
    adults: v.number(),
    children: v.number(),
    totalPrice: v.number(),
    specialRequests: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // 예약 생성
    const reservationId = await ctx.db.insert("reservations", {
      ...args,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    return reservationId;
  },
});

/**
 * 예약 목록 조회 (관리자용)
 * - 모든 예약 또는 상태별 필터링
 */
export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("confirmed"),
        v.literal("cancelled"),
        v.literal("completed")
      )
    ),
  },
  handler: async (ctx, args) => {
    let reservations;

    if (args.status) {
      // 상태별 필터링
      reservations = await ctx.db
        .query("reservations")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    } else {
      // 전체 조회
      reservations = await ctx.db.query("reservations").collect();
    }

    // 최신순 정렬
    return reservations.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/**
 * 특정 예약 상세 조회
 */
export const getById = query({
  args: { reservationId: v.id("reservations") },
  handler: async (ctx, args) => {
    const reservation = await ctx.db.get(args.reservationId);

    if (!reservation) {
      return null;
    }

    // 객실 정보도 함께 가져오기
    const room = await ctx.db.get(reservation.roomId);

    return {
      ...reservation,
      room,
    };
  },
});

/**
 * 예약 상태 변경 (관리자용)
 * - pending → confirmed (확정)
 * - pending/confirmed → cancelled (취소)
 * - confirmed → completed (완료)
 */
export const updateStatus = mutation({
  args: {
    reservationId: v.id("reservations"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("completed")
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    await ctx.db.patch(args.reservationId, {
      status: args.status,
      updatedAt: now,
    });

    return args.reservationId;
  },
});

/**
 * 이메일로 예약 조회 (고객용)
 * - 고객이 자신의 예약을 확인할 때 사용
 */
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const reservations = await ctx.db
      .query("reservations")
      .filter((q) => q.eq(q.field("guestEmail"), args.email))
      .collect();

    // 각 예약에 객실 정보 추가
    const reservationsWithRooms = await Promise.all(
      reservations.map(async (reservation) => {
        const room = await ctx.db.get(reservation.roomId);
        return {
          ...reservation,
          room,
        };
      })
    );

    // 최신순 정렬
    return reservationsWithRooms.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/**
 * 특정 객실의 예약 조회
 * - 달력에 예약된 날짜 표시용
 */
export const getByRoom = query({
  args: {
    roomId: v.id("rooms"),
    month: v.optional(v.string()), // "2026-02" 형식
  },
  handler: async (ctx, args) => {
    let reservations = await ctx.db
      .query("reservations")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "pending"),
          q.eq(q.field("status"), "confirmed")
        )
      )
      .collect();

    // 특정 월 필터링
    if (args.month) {
      reservations = reservations.filter(
        (res) =>
          res.checkIn.startsWith(args.month!) ||
          res.checkOut.startsWith(args.month!)
      );
    }

    return reservations;
  },
});

/**
 * 예약 취소 (고객용)
 * - pending 상태일 때만 가능
 */
export const cancel = mutation({
  args: {
    reservationId: v.id("reservations"),
    email: v.string(), // 본인 확인용
  },
  handler: async (ctx, args) => {
    const reservation = await ctx.db.get(args.reservationId);

    if (!reservation) {
      throw new Error("예약을 찾을 수 없습니다.");
    }

    // 이메일 확인
    if (reservation.guestEmail !== args.email) {
      throw new Error("예약자 이메일이 일치하지 않습니다.");
    }

    // pending 상태만 취소 가능
    if (reservation.status !== "pending") {
      throw new Error("확정된 예약은 취소할 수 없습니다. 고객센터로 연락해주세요.");
    }

    await ctx.db.patch(args.reservationId, {
      status: "cancelled",
      updatedAt: Date.now(),
    });

    return args.reservationId;
  },
});

/**
 * 예약 통계 (관리자용)
 */
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const reservations = await ctx.db.query("reservations").collect();

    const stats = {
      total: reservations.length,
      pending: reservations.filter((r) => r.status === "pending").length,
      confirmed: reservations.filter((r) => r.status === "confirmed").length,
      cancelled: reservations.filter((r) => r.status === "cancelled").length,
      completed: reservations.filter((r) => r.status === "completed").length,
      totalRevenue: reservations
        .filter((r) => r.status === "confirmed" || r.status === "completed")
        .reduce((sum, r) => sum + r.totalPrice, 0),
    };

    return stats;
  },
});
