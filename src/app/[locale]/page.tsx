import { setRequestLocale } from "next-intl/server";
import {
  HeroSection,
  FeaturesSection,
  ServicesSection,
  RoomsSection,
  LocationSection,
  HostSection,
  ContactSection,
} from "@/components/landing";

/**
 * 📌 메인 랜딩 페이지
 *
 * V-HOUSE의 첫 인상을 결정하는 가장 중요한 페이지입니다.
 * 마치 영화의 "예고편"처럼 방문자에게 핵심 정보를 전달합니다.
 *
 * 섹션 구성:
 * 1. Hero - 풀스크린 배경 + 핵심 메시지
 * 2. Features - 3가지 핵심 장점
 * 3. Services - 무료 서비스 8가지
 * 4. Rooms - 객실 미리보기
 * 5. Location - 위치 및 교통 정보
 * 6. Host - 호스트 소개
 * 7. Contact - 문의 채널
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      {/* 히어로 섹션 - 첫인상 */}
      <HeroSection />

      {/* 핵심 장점 섹션 - 왜 V-HOUSE인가? */}
      <FeaturesSection />

      {/* 서비스 섹션 - 무료 서비스 */}
      <ServicesSection />

      {/* 객실 섹션 - 방 미리보기 */}
      <RoomsSection />

      {/* 위치 섹션 - 찾아오는 방법 */}
      <LocationSection />

      {/* 호스트 섹션 - 신뢰 구축 */}
      <HostSection />

      {/* 문의 섹션 - CTA */}
      <ContactSection />
    </>
  );
}
