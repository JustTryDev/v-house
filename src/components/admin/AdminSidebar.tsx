"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarDays, BedDouble, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

/**
 * 📌 관리자 사이드바
 *
 * 관리자 페이지의 네비게이션 메뉴입니다.
 * 마치 "사무실의 파일 캐비넷"처럼 각 기능으로 이동할 수 있습니다.
 *
 * 메뉴:
 * - 대시보드
 * - 예약 관리
 * - 객실 관리
 */

interface AdminSidebarProps {
  onLogout: () => void;
}

// 메뉴 아이템 정의
const menuItems = [
  {
    href: "/admin/dashboard",
    icon: Home,
    label: "대시보드",
  },
  {
    href: "/admin/reservations",
    icon: CalendarDays,
    label: "예약 관리",
  },
  {
    href: "/admin/rooms",
    icon: BedDouble,
    label: "객실 관리",
  },
];

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* 모바일 메뉴 버튼 */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 사이드바 */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-gray-900 text-white transform transition-transform duration-300 z-40 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* 로고 영역 */}
        <div className="p-6 border-b border-gray-800">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[var(--color-primary)]">
              V-HOUSE
            </span>
          </Link>
          <p className="text-gray-400 text-sm mt-1">관리자 패널</p>
        </div>

        {/* 메뉴 */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[var(--color-primary)] text-white"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* 하단 영역 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          {/* 웹사이트로 이동 */}
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors mb-2"
          >
            <Home size={20} />
            <span>웹사이트 보기</span>
          </Link>
          {/* 로그아웃 */}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>로그아웃</span>
          </button>
        </div>
      </aside>

      {/* 모바일 오버레이 */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
