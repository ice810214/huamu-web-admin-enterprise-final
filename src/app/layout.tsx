// app/layout.tsx
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Huamu Web Admin",
  description: "鏵莯空間美學設計報價系統後台",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
