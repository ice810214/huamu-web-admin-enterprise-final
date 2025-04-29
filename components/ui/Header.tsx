// components/ui/Header.tsx
"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/libs/firebase";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth/login");
  };

  return (
    <header className="w-full h-14 flex items-center justify-between px-6 bg-white border-b shadow-sm">
      <h1 className="text-lg font-semibold">鏵莯空間美學設計後台</h1>
      <button
        onClick={handleLogout}
        className="text-sm text-red-500 hover:text-red-700"
      >
        登出
      </button>
    </header>
  );
}
