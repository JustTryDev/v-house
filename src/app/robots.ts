import { MetadataRoute } from "next";

/**
 * 📌 robots.txt 생성
 *
 * 검색 엔진 크롤러에게 웹사이트의 어느 부분을 크롤링할 수 있는지 알려주는 파일입니다.
 * 마치 "출입 허가 표지판"처럼 검색 엔진 봇에게 접근 규칙을 알려줍니다.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://v-house.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
