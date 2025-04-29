// libs/quote.ts（新增這兩個 function）
import { db } from "./firebase";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

// 讀取單一報價單
export async function getQuoteById(id: string) {
  const ref = doc(db, "quotes", id);
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  } else {
    return null;
  }
}

// 更新報價單 items 陣列
export async function updateQuoteItems(id: string, items: any[]) {
  const ref = doc(db, "quotes", id);
  await updateDoc(ref, {
    items,
    updatedAt: new Date(),
  });
}
