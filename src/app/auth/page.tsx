"use client";

import { useState } from "react";
import { login, register } from "@/libs/auth";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setError("");
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">{isLogin ? "登入" : "註冊"}</h1>

      <input
        type="email"
        placeholder="Email"
        className="border p-2 mb-2 w-64"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="密碼"
        className="border p-2 mb-4 w-64"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 mb-2 rounded"
      >
        {isLogin ? "登入" : "註冊"}
      </button>
      <button onClick={() => setIsLogin(!isLogin)} className="underline text-sm">
        {isLogin ? "沒有帳號？點我註冊" : "已有帳號？點我登入"}
      </button>
    </div>
  );
}
