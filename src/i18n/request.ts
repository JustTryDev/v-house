import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/**
 * 📌 요청 시점의 i18n 설정
 *
 * 마치 "통역사"가 사용자의 언어를 확인하고
 * 해당 언어의 번역본을 가져오는 것과 같습니다.
 *
 * 서버 컴포넌트에서 번역 메시지를 사용할 수 있게 해줍니다.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // URL에서 언어 코드 추출 (예: /vi → "vi")
  let locale = await requestLocale;

  // 지원하지 않는 언어이거나 없으면 기본 언어(베트남어) 사용
  if (!locale || !routing.locales.includes(locale as "vi" | "ko" | "en")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    // 해당 언어의 번역 파일 불러오기
    // 예: locale이 "vi"이면 messages/vi.json 파일을 불러옴
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
