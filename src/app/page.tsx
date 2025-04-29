// app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/libs/firebase";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // 登入成功，導向 Dashboard
        router.push("/dashboard");
      } else {
        // 尚未登入，導向 Auth 登入頁
        router.push("/auth/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Huamu Web Admin</h1>
      <p className="text-gray-500">頁面載入中，請稍候...</p>
    </main>
  );
}
