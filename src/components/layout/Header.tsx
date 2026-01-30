"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";

/**
 * 📌 헤더 컴포넌트
 *
 * 웹사이트 상단에 고정되는 네비게이션 바입니다.
 * 마치 건물의 "간판"과 같은 역할을 합니다.
 *
 * 주요 기능:
 * - 로고 표시 (클릭시 홈으로 이동)
 * - 네비게이션 메뉴 (객실, 서비스, 위치, 문의)
 * - 언어 선택 버튼
 * - 모바일에서는 햄버거 메뉴로 변환
 */
export function Header() {
  // 모바일 메뉴 열림/닫힘 상태
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // 번역 메시지 가져오기
  const t = useTranslations("nav");

  // 네비게이션 링크 목록
  const navLinks = [
    { href: "#rooms", label: t("rooms") },
    { href: "#services", label: t("services") },
    { href: "#location", label: t("location") },
    { href: "#contact", label: t("contact") },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[var(--color-primary)]">
              V-HOUSE
            </span>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-[var(--color-primary)] transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* 우측: 언어 선택 + 예약 버튼 */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              href="/booking"
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-5 py-2.5 rounded-lg font-semibold transition-colors"
            >
              {t("booking")}
            </Link>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600"
            aria-label="메뉴 열기"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-600 hover:text-[var(--color-primary)] transition-colors font-medium py-2"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <LanguageSwitcher />
                <Link
                  href="/booking"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-5 py-2.5 rounded-lg font-semibold transition-colors"
                >
                  {t("booking")}
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
