// app/auth/login/page.tsx
"use client";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/libs/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (error) {
      console.error("登入失敗", error);
    }
  };

  const handleLineLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_LINE_CHANNEL_ID;
    const redirectUri = process.env.NEXT_PUBLIC_LINE_REDIRECT_URI;
    const state = "random" + new Date().getTime();

    const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=profile%20openid%20email&bot_prompt=normal`;

    window.location.href = lineLoginUrl;
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 space-y-4">
        <h1 className="text-xl font-semibold text-center">登入後台</h1>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          使用 Google 登入
        </button>
        <button
          onClick={handleLineLogin}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          使用 LINE 登入
        </button>
      </div>
    </main>
  );
}
