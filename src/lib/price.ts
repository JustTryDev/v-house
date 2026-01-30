/**
 * 📌 가격 유틸리티 함수
 *
 * 가격을 원화와 베트남 동으로 표시하는 함수들입니다.
 * 편의점에서 가격표를 보는 것과 비슷해요!
 *
 * 베트남 여행객이 한눈에 가격을 파악할 수 있도록
 * 원화와 VND를 함께 보여줍니다.
 */

/**
 * 숫자를 천 단위 콤마가 있는 문자열로 변환
 *
 * @example
 * formatNumber(50000) // "50,000"
 * formatNumber(1234567) // "1,234,567"
 */
export function formatNumber(value: number): string {
  return value.toLocaleString("ko-KR");
}

/**
 * 원화 금액을 VND로 환산
 *
 * 환산 공식: VND = KRW ÷ 환율
 * 예: 50,000원 ÷ 0.054 = 약 926,000 VND
 *
 * @param krwAmount 원화 금액
 * @param vndRate VND 환율 (1원당 VND 가치)
 * @returns VND 금액 (반올림)
 */
export function convertToVND(krwAmount: number, vndRate: number): number {
  if (vndRate <= 0) return 0;
  // 환율은 "1원 = X VND" 형식이 아니라 "1 VND = X원" 형식
  // 따라서 KRW / rate = VND
  return Math.round(krwAmount / vndRate);
}

/**
 * 원화와 VND를 함께 표시하는 포맷 문자열 생성
 *
 * @example
 * formatPriceWithVND(50000, 0.054)
 * // "₩50,000 (≈ ₫926,000)"
 *
 * @param krwAmount 원화 금액
 * @param vndRate VND 환율 (nullable - 없으면 원화만 표시)
 * @returns 포맷된 가격 문자열
 */
export function formatPriceWithVND(
  krwAmount: number,
  vndRate: number | null
): string {
  const krwFormatted = `₩${formatNumber(krwAmount)}`;

  if (!vndRate || vndRate <= 0) {
    return krwFormatted;
  }

  const vndAmount = convertToVND(krwAmount, vndRate);
  const vndFormatted = `₫${formatNumber(vndAmount)}`;

  return `${krwFormatted} (≈ ${vndFormatted})`;
}

/**
 * 원화만 포맷하여 반환
 *
 * @example
 * formatKRW(50000) // "₩50,000"
 */
export function formatKRW(amount: number): string {
  return `₩${formatNumber(amount)}`;
}

/**
 * VND만 포맷하여 반환
 *
 * @example
 * formatVND(926000) // "₫926,000"
 */
export function formatVND(amount: number): string {
  return `₫${formatNumber(amount)}`;
}

/**
 * 환율 정보와 함께 가격 객체 반환
 * UI에서 원화와 VND를 별도로 스타일링할 때 사용
 *
 * @example
 * getPriceInfo(50000, 0.054)
 * // { krw: 50000, vnd: 926000, krwFormatted: "₩50,000", vndFormatted: "₫926,000" }
 */
export function getPriceInfo(
  krwAmount: number,
  vndRate: number | null
): {
  krw: number;
  vnd: number | null;
  krwFormatted: string;
  vndFormatted: string | null;
} {
  const vnd = vndRate ? convertToVND(krwAmount, vndRate) : null;

  return {
    krw: krwAmount,
    vnd,
    krwFormatted: formatKRW(krwAmount),
    vndFormatted: vnd !== null ? formatVND(vnd) : null,
  };
}
