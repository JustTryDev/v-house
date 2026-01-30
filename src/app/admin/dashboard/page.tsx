"use client";

import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminSidebar } from "@/components/admin";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";

/**
 * 📌 관리자 대시보드
 *
 * 예약 현황과 통계를 한눈에 볼 수 있는 페이지입니다.
 * 마치 "조종석 계기판"처럼 중요한 정보를 요약해서 보여줍니다.
 *
 * 표시 정보:
 * - 총 예약 수
 * - 대기 중인 예약
 * - 확정된 예약
 * - 취소된 예약
 * - 총 매출
 */
export default function AdminDashboardPage() {
  const { isAuthenticated, isLoading, logout, requireAuth } = useAdminAuth();

  // 인증 확인
  useEffect(() => {
    requireAuth();
  }, [isLoading, isAuthenticated, requireAuth]);

  // 예약 통계 가져오기
  const stats = useQuery(api.reservations.getStats);
  // 최근 예약 목록
  const recentReservations = useQuery(api.reservations.list, { status: undefined });

  // 로딩 중이거나 미인증
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
      </div>
    );
  }

  // 통계 카드 데이터
  const statCards = [
    {
      label: "총 예약",
      value: stats?.total ?? 0,
      icon: CalendarDays,
      color: "bg-blue-500",
    },
    {
      label: "대기 중",
      value: stats?.pending ?? 0,
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      label: "확정",
      value: stats?.confirmed ?? 0,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      label: "취소",
      value: stats?.cancelled ?? 0,
      icon: XCircle,
      color: "bg-red-500",
    },
  ];

  // 금액 포맷
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  // 날짜 포맷
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // 상태 뱃지
  const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
    };

    const labels: Record<string, string> = {
      pending: "대기",
      confirmed: "확정",
      cancelled: "취소",
      completed: "완료",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}
      >
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 사이드바 */}
      <AdminSidebar onLogout={logout} />

      {/* 메인 콘텐츠 */}
      <main className="lg:ml-64 p-6 lg:p-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-600">V-HOUSE 예약 현황을 확인하세요</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                <p className="text-gray-500 text-sm">{card.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* 총 매출 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-[var(--color-primary)] to-orange-400 rounded-xl p-6 text-white mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-6 h-6" />
            <span className="font-medium">총 매출 (확정 + 완료)</span>
          </div>
          <p className="text-4xl font-bold">
            ₩{formatPrice(stats?.totalRevenue ?? 0)}
          </p>
        </motion.div>

        {/* 최근 예약 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">최근 예약</h2>
          </div>

          {recentReservations === undefined ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : recentReservations.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              아직 예약이 없습니다.
            </div>
          ) : (
            <div className="divide-y">
              {recentReservations.slice(0, 5).map((reservation) => (
                <div
                  key={reservation._id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {reservation.guestName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {reservation.checkIn} ~ {reservation.checkOut}
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={reservation.status} />
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(reservation.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
