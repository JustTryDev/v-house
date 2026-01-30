"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminSidebar } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Edit, Plus, Loader2 } from "lucide-react";
import Image from "next/image";

/**
 * 📌 객실 관리 페이지
 *
 * 객실 정보를 조회하고 수정하는 페이지입니다.
 * 마치 "객실 카탈로그"처럼 모든 객실을 관리할 수 있습니다.
 *
 * 기능:
 * - 객실 목록 조회
 * - 객실 정보 수정 (가격, 수용인원, 활성화 등)
 * - 초기 데이터 시드
 */

export default function AdminRoomsPage() {
  const { isAuthenticated, isLoading, logout, requireAuth } = useAdminAuth();
  const [selectedRoom, setSelectedRoom] = useState<Id<"rooms"> | null>(null);
  const [editPrice, setEditPrice] = useState(50000);
  const [editCapacity, setEditCapacity] = useState(4);
  const [isSeeding, setIsSeeding] = useState(false);

  // 인증 확인
  useEffect(() => {
    requireAuth();
  }, [isLoading, isAuthenticated, requireAuth]);

  // 객실 목록 가져오기 (관리자용: 비활성화된 객실도 포함)
  const rooms = useQuery(api.rooms.listAll);

  // 뮤테이션
  const updateRoom = useMutation(api.rooms.update);
  const seedRooms = useMutation(api.rooms.seedRooms);

  // 로딩 중이거나 미인증
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
      </div>
    );
  }

  // 선택된 객실 찾기
  const selectedRoomData = rooms?.find((r) => r._id === selectedRoom);

  // 객실 선택시 초기값 설정
  const handleSelectRoom = (roomId: Id<"rooms">) => {
    const room = rooms?.find((r) => r._id === roomId);
    if (room) {
      setEditPrice(room.price);
      setEditCapacity(room.capacity);
      setSelectedRoom(roomId);
    }
  };

  // 객실 정보 수정
  const handleUpdateRoom = async () => {
    if (!selectedRoom) return;

    try {
      await updateRoom({
        roomId: selectedRoom,
        price: editPrice,
        capacity: editCapacity,
      });
      toast.success("객실 정보가 수정되었습니다.");
      setSelectedRoom(null);
    } catch (error) {
      console.error("수정 실패:", error);
      toast.error("수정에 실패했습니다.");
    }
  };

  // 객실 활성화/비활성화
  const handleToggleAvailable = async (
    roomId: Id<"rooms">,
    isAvailable: boolean
  ) => {
    try {
      await updateRoom({ roomId, isAvailable });
      toast.success(isAvailable ? "객실이 활성화되었습니다." : "객실이 비활성화되었습니다.");
    } catch (error) {
      console.error("상태 변경 실패:", error);
      toast.error("상태 변경에 실패했습니다.");
    }
  };

  // 초기 데이터 시드
  const handleSeedRooms = async () => {
    setIsSeeding(true);
    try {
      const result = await seedRooms({});
      toast.success(result.message);
    } catch (error) {
      console.error("시드 실패:", error);
      toast.error("데이터 생성에 실패했습니다.");
    } finally {
      setIsSeeding(false);
    }
  };

  // 금액 포맷
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 사이드바 */}
      <AdminSidebar onLogout={logout} />

      {/* 메인 콘텐츠 */}
      <main className="lg:ml-64 p-6 lg:p-8">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">객실 관리</h1>
            <p className="text-gray-600">객실 정보를 관리하세요</p>
          </div>

          {/* 초기 데이터 생성 버튼 */}
          {rooms && rooms.length === 0 && (
            <Button
              onClick={handleSeedRooms}
              disabled={isSeeding}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]"
            >
              {isSeeding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  생성 중...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  초기 데이터 생성
                </>
              )}
            </Button>
          )}
        </div>

        {/* 객실 목록 */}
        {rooms === undefined ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <p className="text-gray-500 mb-4">
              등록된 객실이 없습니다.
            </p>
            <p className="text-sm text-gray-400">
              &quot;초기 데이터 생성&quot; 버튼을 클릭하여 6개의 객실을 생성하세요.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="bg-white rounded-xl overflow-hidden shadow-sm"
              >
                {/* 객실 이미지 */}
                <div className="relative h-40">
                  <Image
                    src={room.images[0] || "/images/room-happiness-1.jpg"}
                    alt={room.nameKo}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* 활성화 상태 뱃지 */}
                  <div
                    className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${
                      room.isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {room.isAvailable ? "활성" : "비활성"}
                  </div>
                </div>

                {/* 객실 정보 */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">{room.nameKo}</h3>
                    <span className="text-sm text-gray-500">{room.name}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>₩{formatPrice(room.price)}/박</span>
                    <span>최대 {room.capacity}명</span>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* 활성화 토글 */}
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={room.isAvailable}
                        onCheckedChange={(checked) =>
                          handleToggleAvailable(room._id, checked)
                        }
                      />
                      <span className="text-sm text-gray-500">예약 가능</span>
                    </div>

                    {/* 수정 버튼 */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSelectRoom(room._id)}
                    >
                      <Edit size={16} className="mr-1" />
                      수정
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 객실 수정 모달 */}
      <Dialog open={!!selectedRoom} onOpenChange={() => setSelectedRoom(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>객실 정보 수정</DialogTitle>
          </DialogHeader>

          {selectedRoomData && (
            <div className="space-y-4">
              {/* 객실 이름 (읽기 전용) */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-900">
                  {selectedRoomData.nameKo}
                </p>
                <p className="text-sm text-gray-500">{selectedRoomData.name}</p>
              </div>

              {/* 가격 */}
              <div>
                <Label htmlFor="price">1박 가격 (원)</Label>
                <Input
                  id="price"
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              {/* 수용 인원 */}
              <div>
                <Label htmlFor="capacity">최대 수용 인원</Label>
                <Input
                  id="capacity"
                  type="number"
                  min={1}
                  max={10}
                  value={editCapacity}
                  onChange={(e) => setEditCapacity(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              {/* 저장 버튼 */}
              <Button
                onClick={handleUpdateRoom}
                className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]"
              >
                저장
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
