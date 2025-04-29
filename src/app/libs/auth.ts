import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

// 註冊新帳號
export const register = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// 登入
export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// 登出
export const logout = () => {
  return signOut(auth);
};

// 使用者狀態監聽
export const onUserStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// src/libs/auth.ts

export function isAuthenticated(): boolean {
    // 模擬驗證，之後可串 Firebase Auth
    return true;
  }
  