"use client";

import { useState, useEffect } from "react";

/**
 * 📌 환율 훅
 *
 * 환율 API를 호출하여 실시간 환율 정보를 가져옵니다.
 * 날씨 앱에서 현재 날씨를 가져오는 것과 비슷해요!
 *
 * 사용법:
 * const { vndRate, isLoading, error } = useExchangeRate();
 */

// 환율 API 응답 타입
interface ExchangeRateResponse {
  currencyCode: string;
  currencyName: string;
  baseLine: number; // 매매 기준율
  buyRate: number; // 매입율
  sellRate: number; // 매도율
  timestamp: string;
  cached?: boolean;
  fallback?: boolean;
  error?: string;
}

// 훅 반환 타입
interface UseExchangeRateReturn {
  vndRate: number | null; // VND 환율 (1 VND = ? KRW)
  isLoading: boolean; // 로딩 중 여부
  error: string | null; // 에러 메시지
  refetch: () => void; // 수동 새로고침
}

// 기본 환율 (API 실패 시 사용)
const DEFAULT_VND_RATE = 0.054;

// 캐시 키 (localStorage)
const CACHE_KEY = "vhouse_vnd_rate";
const CACHE_DURATION = 60 * 60 * 1000; // 1시간

/**
 * localStorage에서 캐시된 환율 가져오기
 */
function getCachedRate(): number | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { rate, timestamp } = JSON.parse(cached);
    const now = Date.now();

    // 캐시가 1시간 이내면 사용
    if (now - timestamp < CACHE_DURATION) {
      return rate;
    }
  } catch {
    // 캐시 파싱 실패 시 무시
  }

  return null;
}

/**
 * localStorage에 환율 캐시 저장
 */
function setCachedRate(rate: number): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        rate,
        timestamp: Date.now(),
      })
    );
  } catch {
    // localStorage 저장 실패 시 무시
  }
}

/**
 * VND 환율을 가져오는 커스텀 훅
 *
 * @returns 환율 정보, 로딩 상태, 에러
 *
 * @example
 * const { vndRate, isLoading } = useExchangeRate();
 *
 * if (isLoading) return <Spinner />;
 *
 * // vndRate를 사용하여 가격 계산
 * const vndPrice = krwPrice / vndRate;
 */
export function useExchangeRate(): UseExchangeRateReturn {
  const [vndRate, setVndRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 환율 가져오기 함수
  const fetchRate = async () => {
    setIsLoading(true);
    setError(null);

    // 먼저 캐시 확인
    const cachedRate = getCachedRate();
    if (cachedRate) {
      setVndRate(cachedRate);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/exchange-rate?currency=VND");
      const data: ExchangeRateResponse = await response.json();

      if (data.baseLine) {
        setVndRate(data.baseLine);
        setCachedRate(data.baseLine);
      } else {
        // API 응답에 환율이 없으면 기본값 사용
        setVndRate(DEFAULT_VND_RATE);
      }
    } catch (err) {
      console.error("환율 조회 실패:", err);
      setError("환율을 가져올 수 없습니다");
      // 오류 시 기본값 사용
      setVndRate(DEFAULT_VND_RATE);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 환율 가져오기
  useEffect(() => {
    fetchRate();
  }, []);

  // 수동 새로고침 함수
  const refetch = () => {
    // 캐시 삭제 후 새로 가져오기
    if (typeof window !== "undefined") {
      localStorage.removeItem(CACHE_KEY);
    }
    fetchRate();
  };

  return {
    vndRate,
    isLoading,
    error,
    refetch,
  };
}
