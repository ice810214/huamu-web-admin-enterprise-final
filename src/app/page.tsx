"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onUserStateChange } from "@/libs/auth";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onUserStateChange((user) => {
      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/auth");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-center">鏵莯空間美學設計報價系統</h1>
      <p className="text-gray-600 mt-2">頁面導向中，請稍候...</p>
    </main>
  );
}
