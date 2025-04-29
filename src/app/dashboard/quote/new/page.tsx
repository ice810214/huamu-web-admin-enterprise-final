"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/libs/firebase";
import { createQuote } from "@/libs/quote";

export default function QuoteCreatePage() {
  const [title, setTitle] = useState("");
  const [uid, setUid] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid);
      else router.push("/auth/login");
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async () => {
    if (!uid) return;

    const newId = await createQuote(title, uid);
    router.push(`/dashboard/quote/${newId}`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">新增報價單</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          報價單名稱
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 p-2 w-full border border-gray-300 rounded"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        儲存
      </button>
    </div>
  );
}

