"use client";

import { useEffect, useState } from "react";
import { onUserStateChange, logout } from "@/libs/auth";

export default function SettingsPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const appVersion = "v2.0.0"; // 最終正式版本號

  useEffect(() => {
    const unsubscribe = onUserStateChange((user) => {
      if (user) setUserEmail(user.email);
      else setUserEmail(null);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logout();
    alert("已成功登出");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">設定頁面</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-1">登入帳號</h2>
        <p className="text-gray-700">{userEmail || "未登入"}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-1">App版本</h2>
        <p className="text-gray-700">{appVersion}</p>
        <p className="text-xs text-gray-400 mt-1">by 碩</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-1">LINE綁定（預留）</h2>
        <p className="text-gray-600 text-sm mb-2">尚未開啟，待後續OAuth整合</p>
        <button
          disabled
          className="bg-gray-400 text-white px-4 py-2 rounded opacity-70 cursor-not-allowed"
        >
          綁定LINE帳號
        </button>
      </div>

      <div>
        <button
          onClick={handleLogout}
          className="bg-black text-white px-4 py-2 rounded"
        >
          登出
        </button>
      </div>
    </div>
  );
}
