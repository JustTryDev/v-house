import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";
import { routing, Locale } from "@/i18n/routing";
import { Header, Footer } from "@/components/layout";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";

/**
 * 📌 다국어 레이아웃
 *
 * 이 파일은 "언어별 인테리어"와 같습니다.
 * URL의 언어 코드(/vi, /ko, /en)에 따라
 * 해당 언어의 번역 메시지를 모든 하위 페이지에 제공합니다.
 *
 * 예: /vi/rooms → 베트남어 번역 제공
 *     /ko/rooms → 한국어 번역 제공
 */

// 정적 생성을 위한 언어 목록
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// 동적 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://v-house.vercel.app";

  // 언어별 메타데이터
  const titles: Record<Locale, string> = {
    vi: "V-HOUSE - Ngôi nhà Việt giữa lòng Hàn Quốc",
    ko: "V-HOUSE - 한국 속 베트남의 집",
    en: "V-HOUSE - Your Vietnamese Home in Korea",
  };

  const descriptions: Record<Locale, string> = {
    vi: "Nhà nghỉ thân thiện cho người Việt tại Incheon, chỉ 15 phút từ sân bay. Chủ nhà người Việt, dịch vụ tận tâm.",
    ko: "인천공항 15분 거리, 베트남인 호스트가 운영하는 따뜻한 게스트하우스. 베트남어 소통 가능.",
    en: "Friendly guesthouse for Vietnamese travelers in Incheon, just 15 minutes from the airport. Vietnamese-speaking host.",
  };

  const title = titles[locale as Locale] || titles.vi;
  const description = descriptions[locale as Locale] || descriptions.vi;

  return {
    title,
    description,
    // Open Graph (소셜 미디어 공유용)
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}`,
      siteName: "V-HOUSE",
      images: [
        {
          url: `${baseUrl}/images/common-area.jpg`,
          width: 1200,
          height: 630,
          alt: "V-HOUSE 게스트하우스",
        },
      ],
      locale: locale === "vi" ? "vi_VN" : locale === "ko" ? "ko_KR" : "en_US",
      type: "website",
    },
    // Twitter 카드
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/images/common-area.jpg`],
    },
    // 추가 메타태그
    keywords:
      locale === "vi"
        ? "nhà nghỉ Incheon, guesthouse Hàn Quốc, chỗ ở gần sân bay Incheon, nhà nghỉ giá rẻ"
        : locale === "ko"
          ? "인천 게스트하우스, 인천공항 숙소, 베트남 게스트하우스, 운서동 숙소"
          : "Incheon guesthouse, airport accommodation, Vietnam guesthouse Korea",
    // 언어별 대체 URL
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        vi: `${baseUrl}/vi`,
        ko: `${baseUrl}/ko`,
        en: `${baseUrl}/en`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 지원하지 않는 언어면 404 페이지
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // 정적 렌더링 활성화
  setRequestLocale(locale);

  // 해당 언어의 번역 메시지 가져오기
  const messages = await getMessages();

  return (
    <>
      {/* NextIntlClientProvider: 클라이언트 컴포넌트에서도 번역 사용 가능하게 함 */}
      <NextIntlClientProvider messages={messages}>
        {/* ConvexClientProvider: Convex 데이터베이스 연결 */}
        <ConvexClientProvider>
          {/* 헤더 - 모든 페이지 상단에 고정 */}
          <Header />
          {/* 메인 콘텐츠 */}
          <main>{children}</main>
          {/* 푸터 - 모든 페이지 하단에 표시 */}
          <Footer />
        </ConvexClientProvider>
      </NextIntlClientProvider>
      {/* 토스트 알림 (sonner) */}
      <Toaster position="top-center" richColors closeButton />
    </>
  );
}
