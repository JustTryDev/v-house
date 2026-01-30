import { MetadataRoute } from "next";

/**
 * 📌 sitemap.xml 생성
 *
 * 검색 엔진에게 웹사이트의 모든 페이지 목록을 알려주는 파일입니다.
 * 마치 "웹사이트 지도"처럼 크롤러가 모든 페이지를 찾을 수 있게 도와줍니다.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://v-house.vercel.app";

  // 지원하는 언어 목록
  const locales = ["vi", "ko", "en"];

  // 기본 페이지 목록
  const routes = ["", "/rooms", "/booking"];

  // 각 언어별로 모든 페이지 생성
  const pages = locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    }))
  );

  return pages;
}
