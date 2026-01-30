"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

/**
 * 📌 언어 선택 컴포넌트
 *
 * 드롭다운 방식으로 언어를 선택할 수 있는 컴포넌트입니다.
 * 마치 TV 리모컨의 "언어 설정" 버튼과 같습니다.
 *
 * 지원 언어:
 * - 베트남어 (vi) - 기본
 * - 한국어 (ko)
 * - 영어 (en)
 *
 * 📌 국기 아이콘:
 * flag-icons 라이브러리 사용 (CDN)
 * https://github.com/lipis/flag-icons
 */

// 언어 목록 정의
// flagCode는 flag-icons의 국가 코드 (ISO 3166-1 alpha-2)
const languages = [
  { code: "vi", label: "Tiếng Việt", flagCode: "vn" },
  { code: "ko", label: "한국어", flagCode: "kr" },
  { code: "en", label: "English", flagCode: "us" },
] as const;

export function LanguageSwitcher() {
  // 현재 선택된 언어
  const locale = useLocale();
  // 현재 페이지 경로
  const pathname = usePathname();
  // 라우터 (페이지 이동용)
  const router = useRouter();
  // 드롭다운 열림/닫힘 상태
  const [isOpen, setIsOpen] = useState(false);
  // 드롭다운 바깥 클릭 감지용 ref
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 현재 언어 정보 가져오기
  const currentLang = languages.find((lang) => lang.code === locale) || languages[0];

  // 언어 변경 핸들러
  const handleLanguageChange = (langCode: string) => {
    // 같은 페이지에서 언어만 변경
    router.replace(pathname, { locale: langCode });
    setIsOpen(false);
  };

  // 바깥 클릭시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 현재 언어 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {/* 국기 아이콘 (flag-icons) */}
        <span
          className={`fi fi-${currentLang.flagCode} rounded shadow-sm`}
          style={{ fontSize: "1.25rem" }}
        />
        <span className="text-sm font-medium text-gray-700">
          {currentLang.code.toUpperCase()}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 py-2 min-w-[160px] z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                lang.code === locale
                  ? "bg-orange-50 text-[var(--color-primary)]"
                  : "text-gray-700"
              }`}
            >
              {/* 국기 아이콘 (flag-icons) */}
              <span
                className={`fi fi-${lang.flagCode} rounded shadow-sm`}
                style={{ fontSize: "1.25rem" }}
              />
              <span className="text-sm font-medium">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
