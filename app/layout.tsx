import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ToiME Staycation",
  description: "Đặt phòng homestay/villa — 4 loại đặt linh hoạt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
