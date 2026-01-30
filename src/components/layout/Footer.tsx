"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Phone, Mail, MapPin } from "lucide-react";

/**
 * 📌 푸터 컴포넌트
 *
 * 웹사이트 하단에 표시되는 정보 영역입니다.
 * 마치 명함의 뒷면처럼 연락처와 저작권 정보를 담고 있습니다.
 *
 * 포함 정보:
 * - 로고 및 간단한 소개
 * - 연락처 정보
 * - 저작권 정보
 */

// 게스트하우스 기본 정보 (하드코딩 방지)
const CONTACT_INFO = {
  phone: "+82 10-8248-6136",
  email: "vhouse.incheon@gmail.com",
  address: "3060-35, Unseo-dong, Jung-gu, Incheon",
};

export function Footer() {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 로고 및 소개 */}
          <div>
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold text-[var(--color-primary)]">
                V-HOUSE
              </span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </div>

          {/* 빠른 링크 */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <a href="#rooms" className="text-gray-400 hover:text-white transition-colors text-sm">
                {t("nav.rooms")}
              </a>
              <a href="#services" className="text-gray-400 hover:text-white transition-colors text-sm">
                {t("nav.services")}
              </a>
              <a href="#location" className="text-gray-400 hover:text-white transition-colors text-sm">
                {t("nav.location")}
              </a>
              <a href="#contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                {t("nav.contact")}
              </a>
            </nav>
          </div>

          {/* 연락처 */}
          <div>
            <h3 className="font-semibold mb-4">{t("nav.contact")}</h3>
            <div className="flex flex-col gap-3">
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <Phone size={16} />
                <span>{CONTACT_INFO.phone}</span>
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <Mail size={16} />
                <span>{CONTACT_INFO.email}</span>
              </a>
              <div className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>{t("footer.address")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 저작권 */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} V-HOUSE. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
