/**
 * 📌 로딩 페이지
 *
 * 페이지가 로딩되는 동안 보여주는 스켈레톤 UI입니다.
 * 마치 "기다려주세요" 안내판처럼 사용자에게 로딩 중임을 알립니다.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* 히어로 섹션 스켈레톤 */}
      <div className="h-screen bg-gray-200 animate-pulse flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-32 h-8 bg-gray-300 rounded-full mx-auto" />
          <div className="w-64 h-12 bg-gray-300 rounded-lg mx-auto" />
          <div className="w-48 h-6 bg-gray-300 rounded-lg mx-auto" />
        </div>
      </div>
    </div>
  );
}
