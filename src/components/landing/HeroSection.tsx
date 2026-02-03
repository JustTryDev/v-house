"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown, Plane } from "lucide-react";

/**
 * 📌 히어로 섹션
 *
 * 방문자가 처음 보는 화면입니다.
 * 마치 영화의 "오프닝 장면"처럼 강렬한 첫인상을 줍니다.
 *
 * 구성:
 * - 풀스크린 배경 이미지
 * - 핵심 메시지 (제목, 부제목) + 타이핑 애니메이션
 * - CTA 버튼 (예약하기, 객실 보기)
 * - 스크롤 인디케이터
 */

/**
 * 📌 타이핑 애니메이션 컴포넌트
 *
 * 타자기처럼 한 글자씩 나타나는 효과입니다.
 * 글자가 하나씩 순서대로 등장하여 시선을 사로잡습니다.
 */
interface TypingTextProps {
  text: string;
  delay?: number; // 애니메이션 시작 지연 시간
  className?: string;
}

function TypingText({ text, delay = 0, className = "" }: TypingTextProps) {
  // 문자 단위로 분리
  const characters = text.split("");

  // 컨테이너 애니메이션 (stagger 효과를 위해)
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: 0.05, // 각 글자 사이 딜레이 (0.05초)
      },
    },
  };

  // 각 문자의 애니메이션
  // as const를 붙여서 "easeOut"이 정확한 값임을 TypeScript에게 알려줍니다
  const characterVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.span
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={characterVariants}
          style={{ display: "inline-block" }}
        >
          {/* 공백은 &nbsp;로 처리하여 너비 유지 */}
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

export function HeroSection() {
  const t = useTranslations();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* 배경 이미지 */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/common-area.jpg"
          alt="V-HOUSE 공용 공간"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* 어두운 오버레이 - 텍스트 가독성을 위해 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
      </div>

      {/* 콘텐츠 */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        {/* 뱃지 - 핵심 장점 강조 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
        >
          <Plane className="w-5 h-5" />
          <span className="text-sm font-medium">{t("hero.badge")}</span>
        </motion.div>

        {/* 메인 제목 - 두 줄 + 타이핑 애니메이션 */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
          {/* 첫 번째 줄 */}
          <span className="block">
            <TypingText text={t("hero.titleLine1")} delay={0.3} />
          </span>
          {/* 두 번째 줄 */}
          <span className="block mt-2">
            <TypingText
              text={t("hero.titleLine2")}
              delay={0.3 + t("hero.titleLine1").length * 0.05 + 0.3}
            />
          </span>
        </h1>

        {/* 커서 깜빡임 효과 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            delay: 0.3 + (t("hero.titleLine1").length + t("hero.titleLine2").length) * 0.05 + 0.6,
            duration: 0.8,
            repeat: 3,
            repeatType: "loop",
          }}
          className="inline-block w-1 h-8 md:h-12 bg-white/80 mb-4"
        />

        {/* 부제목 */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.3 + (t("hero.titleLine1").length + t("hero.titleLine2").length) * 0.05 + 0.8,
          }}
          className="text-xl md:text-2xl text-white/90 mb-4"
        >
          {t("hero.subtitle")}
        </motion.p>

        {/* 설명 텍스트 */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.3 + (t("hero.titleLine1").length + t("hero.titleLine2").length) * 0.05 + 1.0,
          }}
          className="text-base md:text-lg text-white/70 mb-8 max-w-2xl mx-auto"
        >
          {t("hero.description")}
        </motion.p>

        {/* CTA 버튼들 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.3 + (t("hero.titleLine1").length + t("hero.titleLine2").length) * 0.05 + 1.2,
          }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/booking"
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
          >
            {t("hero.cta.booking")}
          </Link>
          <a
            href="#rooms"
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg border border-white/30 transition-all duration-300"
          >
            {t("hero.cta.viewRooms")}
          </a>
        </motion.div>
      </div>

      {/* 스크롤 인디케이터 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.6,
          delay: 0.3 + (t("hero.titleLine1").length + t("hero.titleLine2").length) * 0.05 + 1.5,
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <a
          href="#features"
          className="flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <span className="text-sm">Scroll</span>
          <ChevronDown size={24} className="animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
}
