"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Phone, MessageCircle, Facebook, Instagram } from "lucide-react";

/**
 * 📌 문의하기 섹션
 *
 * 예약 문의를 위한 다양한 연락 채널을 제공합니다.
 * 마치 "고객센터 안내"처럼 연락 방법을 명확히 보여줍니다.
 *
 * 연락 채널:
 * - Zalo (베트남 사용자 우선)
 * - 카카오톡 (한국 사용자)
 * - Facebook
 * - Instagram
 * - 전화
 */

// 연락처 정보 (하드코딩 방지)
const CONTACT_INFO = {
  phone: "+82 10-8248-6136",
  zalo: "https://zalo.me/0108248-6136", // 실제 Zalo 링크로 교체 필요
  kakao: "https://open.kakao.com/o/sXXXXXX", // 실제 카카오톡 오픈채팅 링크로 교체 필요
  facebook: "https://facebook.com/vhouse.incheon", // 실제 Facebook 페이지로 교체 필요
  instagram: "https://instagram.com/vhouse.incheon", // 실제 Instagram으로 교체 필요
};

// SNS 버튼 스타일 정의
const socialButtons = [
  {
    key: "zalo",
    icon: MessageCircle,
    href: CONTACT_INFO.zalo,
    color: "bg-blue-500 hover:bg-blue-600",
    label: "Zalo",
  },
  {
    key: "kakao",
    icon: MessageCircle,
    href: CONTACT_INFO.kakao,
    color: "bg-yellow-400 hover:bg-yellow-500 text-gray-900",
    label: "KakaoTalk",
  },
  {
    key: "facebook",
    icon: Facebook,
    href: CONTACT_INFO.facebook,
    color: "bg-[#1877F2] hover:bg-[#166FE5]",
    label: "Facebook",
  },
  {
    key: "instagram",
    icon: Instagram,
    href: CONTACT_INFO.instagram,
    color: "bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-90",
    label: "Instagram",
  },
];

export function ContactSection() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="py-20 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h2>
          <p className="text-gray-400 text-lg mb-10">{t("subtitle")}</p>
        </motion.div>

        {/* SNS 버튼 그리드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {socialButtons.map((social) => {
            const Icon = social.icon;

            return (
              <a
                key={social.key}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${social.color} text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2`}
              >
                <Icon size={20} />
                <span>{social.label}</span>
              </a>
            );
          })}
        </motion.div>

        {/* 전화번호 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gray-800 rounded-2xl p-6 inline-block"
        >
          <p className="text-gray-400 text-sm mb-2">{t("phone")}</p>
          <a
            href={`tel:${CONTACT_INFO.phone}`}
            className="flex items-center justify-center gap-3 text-2xl font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors"
          >
            <Phone size={28} />
            <span>{CONTACT_INFO.phone}</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
