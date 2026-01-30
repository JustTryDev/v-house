import { NextRequest, NextResponse } from "next/server";

/**
 * 📌 환율 API 라우트
 *
 * 한국수출입은행(KOREAEXIM) 환율 API를 호출하여
 * 실시간 환율 정보를 가져옵니다.
 *
 * 마트에서 환율 계산기를 보는 것과 비슷해요!
 * - 오늘의 환율을 가져와서
 * - 원하는 통화(VND)의 환율을 찾아
 * - 프론트엔드에 전달합니다.
 */

// API 응답 타입 정의
interface KoreaEximResponse {
  result: number; // 조회 결과 (1: 성공)
  cur_unit: string; // 통화 코드 (USD, VND 등)
  cur_nm: string; // 통화명 (미국 달러, 베트남 동 등)
  ttb: string; // 전신환 매입율 (은행이 살 때)
  tts: string; // 전신환 매도율 (은행이 팔 때)
  deal_bas_r: string; // 매매 기준율
  bkpr: string; // 장부 가격
  yy_efee_r: string; // 년환가료율
  ten_dd_efee_r: string; // 10일 환가료율
  kftc_bkpr: string; // 금융결제원 장부가
  kftc_deal_bas_r: string; // 금융결제원 매매기준율
}

// 캐시 저장소 (메모리 캐싱)
// 환율은 자주 바뀌지 않으므로 1시간 동안 캐싱합니다
let cachedData: {
  rates: KoreaEximResponse[];
  timestamp: number;
} | null = null;

const CACHE_DURATION = 60 * 60 * 1000; // 1시간 (밀리초)

/**
 * 오늘 날짜를 YYYYMMDD 형식으로 반환
 * API 호출 시 필요한 형식입니다
 */
function getTodayString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

/**
 * 문자열에서 콤마 제거 후 숫자로 변환
 * API 응답의 환율은 "1,234.56" 형식이라 변환 필요
 */
function parseRate(rateString: string): number {
  // 콤마 제거 후 숫자로 변환
  const cleaned = rateString.replace(/,/g, "");
  return parseFloat(cleaned) || 0;
}

/**
 * GET /api/exchange-rate
 *
 * 쿼리 파라미터:
 * - currency: 조회할 통화 코드 (기본값: VND)
 *
 * 응답:
 * - currencyCode: 통화 코드
 * - currencyName: 통화명
 * - baseLine: 매매 기준율 (1원당 외화 가치)
 * - buyRate: 매입율
 * - sellRate: 매도율
 * - timestamp: 조회 시간
 */
export async function GET(request: NextRequest) {
  try {
    // 쿼리 파라미터에서 통화 코드 가져오기 (기본값: VND)
    const searchParams = request.nextUrl.searchParams;
    const currencyCode = searchParams.get("currency") || "VND";

    // API 키 확인
    const API_KEY = process.env.KOREAEXIM_API_KEY;
    if (!API_KEY) {
      return NextResponse.json(
        { error: "환율 API 키가 설정되지 않았습니다" },
        { status: 500 }
      );
    }

    // 캐시 확인 (1시간 이내면 캐시 사용)
    const now = Date.now();
    if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
      const rate = cachedData.rates.find(
        (item) => item.cur_unit === currencyCode
      );
      if (rate) {
        return NextResponse.json({
          currencyCode: rate.cur_unit,
          currencyName: rate.cur_nm,
          baseLine: parseRate(rate.deal_bas_r),
          buyRate: parseRate(rate.ttb),
          sellRate: parseRate(rate.tts),
          timestamp: new Date().toISOString(),
          cached: true,
        });
      }
    }

    // 오늘 날짜로 API 호출
    const today = getTodayString();
    const params = new URLSearchParams({
      authkey: API_KEY,
      searchdate: today,
      data: "AP01", // 매매기준율
    });

    // 한국수출입은행 API 호출
    const response = await fetch(
      `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?${params}`,
      {
        next: { revalidate: 3600 }, // Next.js 캐싱: 1시간
      }
    );

    if (!response.ok) {
      // 주말/공휴일에는 데이터가 없을 수 있음
      // 이전 영업일 데이터를 시도하거나 기본값 반환
      return NextResponse.json(
        {
          currencyCode: "VND",
          currencyName: "베트남 동",
          baseLine: 0.054, // 기본 환율 (대략적인 값)
          buyRate: 0.053,
          sellRate: 0.055,
          timestamp: new Date().toISOString(),
          fallback: true,
        },
        { status: 200 }
      );
    }

    const data: KoreaEximResponse[] = await response.json();

    // 빈 배열이면 (주말/공휴일)
    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          currencyCode: "VND",
          currencyName: "베트남 동",
          baseLine: 0.054,
          buyRate: 0.053,
          sellRate: 0.055,
          timestamp: new Date().toISOString(),
          fallback: true,
        },
        { status: 200 }
      );
    }

    // 캐시 업데이트
    cachedData = {
      rates: data,
      timestamp: now,
    };

    // 요청한 통화 찾기
    const rate = data.find((item) => item.cur_unit === currencyCode);

    if (!rate) {
      return NextResponse.json(
        { error: `${currencyCode} 환율을 찾을 수 없습니다` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      currencyCode: rate.cur_unit,
      currencyName: rate.cur_nm,
      baseLine: parseRate(rate.deal_bas_r),
      buyRate: parseRate(rate.ttb),
      sellRate: parseRate(rate.tts),
      timestamp: new Date().toISOString(),
      cached: false,
    });
  } catch (error) {
    console.error("환율 조회 오류:", error);

    // 오류 시에도 기본값 반환 (서비스 중단 방지)
    return NextResponse.json(
      {
        currencyCode: "VND",
        currencyName: "베트남 동",
        baseLine: 0.054,
        buyRate: 0.053,
        sellRate: 0.055,
        timestamp: new Date().toISOString(),
        fallback: true,
        error: "환율 API 호출 실패, 기본값 사용",
      },
      { status: 200 }
    );
  }
}
