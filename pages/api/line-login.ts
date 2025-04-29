// pages/api/line-login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "缺少授權碼" });
  }

  try {
    const tokenRes = await axios.post(
      "https://api.line.me/oauth2/v2.1/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: String(code),
        redirect_uri: process.env.NEXT_PUBLIC_LINE_REDIRECT_URI!,
        client_id: process.env.NEXT_PUBLIC_LINE_CHANNEL_ID!,
        client_secret: process.env.LINE_CHANNEL_SECRET!, // ✅ 須加入 .env（你要提供）
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const access_token = tokenRes.data.access_token;

    const profileRes = await axios.get("https://api.line.me/v2/profile", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const { userId, displayName, pictureUrl } = profileRes.data;

    // 🔐 模擬建立 Firebase Custom Token（此處為假設）
    // 如果你有自己的 backend，可以用 Firebase Admin SDK 建 token
    // 這裡僅演示流程，不會成功登入 Firebase Auth（因為需要 Admin Key）

    const fakeToken = "FAKE_TOKEN_" + userId;

    // 寫入 Firestore 使用者資料
    await setDoc(doc(db, "users", userId), {
      uid: userId,
      displayName,
      pictureUrl,
      provider: "LINE",
      createdAt: new Date(),
    });

    // 模擬登入頁面導向
    return res.redirect(`/dashboard?uid=${userId}`);

  } catch (err: any) {
    console.error("LINE 登入錯誤", err.response?.data || err.message);
    return res.status(500).json({ error: "登入失敗" });
  }
}
