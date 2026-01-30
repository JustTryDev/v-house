import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import { Toaster } from "sonner";

/**
 * 📌 관리자 레이아웃
 *
 * 관리자 페이지 전용 레이아웃입니다.
 * 일반 사용자 페이지와 분리된 독립적인 레이아웃을 사용합니다.
 */
export const metadata = {
  title: "V-HOUSE 관리자",
  description: "V-HOUSE 게스트하우스 관리자 패널",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <ConvexClientProvider>
        {children}
      </ConvexClientProvider>
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}
