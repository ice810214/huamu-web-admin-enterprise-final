// utils/auth.ts
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/libs/firebase";

export const loginWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};
