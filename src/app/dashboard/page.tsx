"use client";

import { useEffect, useState } from "react";
import { logout, onUserStateChange } from "@/libs/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onUserStateChange((user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        router.push("/auth");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.push("/auth");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">歡迎，{userEmail || "使用者"}</h1>
      <button
        onClick={handleLogout}
        className="bg-black text-white px-4 py-2 rounded"
      >
        登出
      </button>
    </div>
  );
}
