"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminSidebar } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Eye, Filter } from "lucide-react";

/**
 * 📌 예약 관리 페이지
 *
 * 모든 예약을 조회하고 상태를 관리하는 페이지입니다.
 * 마치 "예약 대장"처럼 모든 예약 정보를 한눈에 볼 수 있습니다.
 *
 * 기능:
 * - 예약 목록 조회 (상태별 필터)
 * - 예약 상세 보기
 * - 예약 상태 변경 (확정, 취소 등)
 */

type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed";

export default function AdminReservationsPage() {
  const { isAuthenticated, isLoading, logout, requireAuth } = useAdminAuth();
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "all">("all");
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);

  // 인증 확인
  useEffect(() => {
    requireAuth();
  }, [isLoading, isAuthenticated, requireAuth]);

  // 예약 목록 가져오기
  const reservations = useQuery(
    api.reservations.list,
    statusFilter === "all" ? {} : { status: statusFilter as ReservationStatus }
  );

  // 상태 변경 뮤테이션
  const updateStatus = useMutation(api.reservations.updateStatus);

  // 로딩 중이거나 미인증
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
      </div>
    );
  }

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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 상태 변경 핸들러
  const handleStatusChange = async (
    reservationId: Id<"reservations">,
    newStatus: ReservationStatus
  ) => {
    try {
      await updateStatus({ reservationId, status: newStatus });
      toast.success("예약 상태가 변경되었습니다.");
    } catch (error) {
      console.error("상태 변경 실패:", error);
      toast.error("상태 변경에 실패했습니다.");
    }
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

  // 선택된 예약 찾기
  const selectedReservationData = reservations?.find(
    (r) => r._id === selectedReservation
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 사이드바 */}
      <AdminSidebar onLogout={logout} />

      {/* 메인 콘텐츠 */}
      <main className="lg:ml-64 p-6 lg:p-8">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">예약 관리</h1>
            <p className="text-gray-600">모든 예약을 관리하세요</p>
          </div>

          {/* 필터 */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as ReservationStatus | "all")
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="pending">대기</SelectItem>
                <SelectItem value="confirmed">확정</SelectItem>
                <SelectItem value="cancelled">취소</SelectItem>
                <SelectItem value="completed">완료</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 예약 목록 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {reservations === undefined ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : reservations.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              예약이 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      예약자
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      날짜
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      인원
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      금액
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      상태
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      신청일
                    </th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {reservations.map((reservation) => (
                    <tr
                      key={reservation._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {reservation.guestName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {reservation.guestEmail}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {reservation.checkIn} ~ {reservation.checkOut}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        성인 {reservation.adults}
                        {reservation.children > 0 &&
                          `, 어린이 ${reservation.children}`}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ₩{formatPrice(reservation.totalPrice)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={reservation.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(reservation.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedReservation(reservation._id)}
                        >
                          <Eye size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* 예약 상세 모달 */}
      <Dialog
        open={!!selectedReservation}
        onOpenChange={() => setSelectedReservation(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>예약 상세</DialogTitle>
          </DialogHeader>

          {selectedReservationData && (
            <div className="space-y-4">
              {/* 예약자 정보 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">예약자 정보</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-500">이름:</span>{" "}
                    {selectedReservationData.guestName}
                  </p>
                  <p>
                    <span className="text-gray-500">이메일:</span>{" "}
                    {selectedReservationData.guestEmail}
                  </p>
                  <p>
                    <span className="text-gray-500">전화:</span>{" "}
                    {selectedReservationData.guestPhone}
                  </p>
                  <p>
                    <span className="text-gray-500">국적:</span>{" "}
                    {selectedReservationData.guestCountry}
                  </p>
                </div>
              </div>

              {/* 예약 정보 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">예약 정보</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-500">체크인:</span>{" "}
                    {selectedReservationData.checkIn}
                  </p>
                  <p>
                    <span className="text-gray-500">체크아웃:</span>{" "}
                    {selectedReservationData.checkOut}
                  </p>
                  <p>
                    <span className="text-gray-500">인원:</span> 성인{" "}
                    {selectedReservationData.adults}명
                    {selectedReservationData.children > 0 &&
                      `, 어린이 ${selectedReservationData.children}명`}
                  </p>
                  <p>
                    <span className="text-gray-500">금액:</span>{" "}
                    <span className="font-semibold">
                      ₩{formatPrice(selectedReservationData.totalPrice)}
                    </span>
                  </p>
                  {selectedReservationData.specialRequests && (
                    <p>
                      <span className="text-gray-500">요청사항:</span>{" "}
                      {selectedReservationData.specialRequests}
                    </p>
                  )}
                </div>
              </div>

              {/* 상태 변경 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">상태 변경</h3>
                <div className="flex gap-2">
                  {selectedReservationData.status !== "confirmed" && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() =>
                        handleStatusChange(
                          selectedReservationData._id,
                          "confirmed"
                        )
                      }
                    >
                      확정
                    </Button>
                  )}
                  {selectedReservationData.status !== "cancelled" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        handleStatusChange(
                          selectedReservationData._id,
                          "cancelled"
                        )
                      }
                    >
                      취소
                    </Button>
                  )}
                  {selectedReservationData.status === "confirmed" && (
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() =>
                        handleStatusChange(
                          selectedReservationData._id,
                          "completed"
                        )
                      }
                    >
                      완료
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
