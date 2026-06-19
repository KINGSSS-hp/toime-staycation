import type { Metadata } from "next";

export function generatePageMetadata(locale: string): Metadata {
  const isVi = locale === "vi";

  return {
    title: isVi
      ? "ToiME Staycation — Nơi Nghỉ Dưỡng Của Bạn"
      : "ToiME Staycation — Your Getaway Destination",
    description: isVi
      ? "Đặt phòng homestay/villa với 4 loại đặt linh hoạt: Good Morning, Midnight Hot, Overnight, Multi-night. Không cần tài khoản."
      : "Book your homestay/villa with 4 flexible booking types: Good Morning, Midnight Hot, Overnight, Multi-night. No account needed.",
    keywords: isVi
      ? ["homestay", "villa", "đặt phòng", "nghỉ dưỡng", "staycation"]
      : ["homestay", "villa", "booking", "getaway", "staycation"],
    openGraph: {
      title: "ToiME Staycation",
      description: isVi
        ? "Nơi nghỉ dưỡng ấm cúng, yên bình giữa thiên nhiên"
        : "A cozy, peaceful retreat surrounded by nature",
      type: "website",
      locale: isVi ? "vi_VN" : "en_US",
      siteName: "ToiME Staycation",
    },
    robots: { index: true, follow: true },
    alternates: {
      languages: {
        vi: "/vi",
        en: "/en",
      },
    },
  };
}
