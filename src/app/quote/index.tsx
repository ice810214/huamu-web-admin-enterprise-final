"use client";

import { useEffect, useState } from "react";
import { db } from "@/libs/firebase";
import {
  collection,
  addDoc,
  getDocs,
  DocumentData,
  Timestamp,
} from "firebase/firestore";

interface Quote {
  id: string;
  title: string;
  category: string;
  amount: number;
  createdAt: Timestamp;
}

export default function QuotePage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const quotesCollection = collection(db, "quotes");

  const fetchQuotes = async () => {
    setLoading(true);
    const snapshot = await getDocs(quotesCollection);
    const list: Quote[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data() as DocumentData;
      list.push({
        id: doc.id,
        title: data.title,
        category: data.category,
        amount: data.amount,
        createdAt: data.createdAt,
      });
    });
    setQuotes(list);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!title || !category || !amount) {
      alert("請填寫所有欄位！");
      return;
    }

    const newItem = {
      title,
      category,
      amount,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(quotesCollection, newItem);

    setQuotes([
      ...quotes,
      {
        id: docRef.id,
        ...newItem,
      },
    ]);

    setTitle("");
    setCategory("");
    setAmount(0);
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // 分類統整
  const totalsByCategory = quotes.reduce((acc, q) => {
    if (!acc[q.category]) acc[q.category] = 0;
    acc[q.category] += q.amount;
    return acc;
  }, {} as Record<string, number>);

  const overallTotal = quotes.reduce((acc, q) => acc + q.amount, 0);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">報價單管理</h1>

      <div className="grid gap-2 mb-6">
        <input
          type="text"
          placeholder="項目名稱"
          className="border p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="分類（例如：木作、水電）"
          className="border p-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="number"
          placeholder="金額"
          className="border p-2"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />
        <button
          onClick={handleAdd}
          className="bg-black text-white px-4 py-2 rounded"
        >
          新增報價項目
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">分類金額統整</h2>
      <div className="mb-6">
        {Object.entries(totalsByCategory).map(([category, total]) => (
          <p key={category}>
            <strong>{category}：</strong>
            {total.toLocaleString()} 元
          </p>
        ))}
        <p className="mt-2 font-bold">總計：{overallTotal.toLocaleString()} 元</p>
      </div>

      <h2 className="text-xl font-semibold mb-2">報價項目列表</h2>
      {loading ? (
        <p>載入中...</p>
      ) : quotes.length === 0 ? (
        <p className="text-gray-500">尚無報價資料</p>
      ) : (
        <div className="grid gap-3">
          {quotes.map((q) => (
            <div key={q.id} className="border p-3 rounded shadow-sm">
              <p>
                <strong>{q.title}</strong> ({q.category}) –{" "}
                {q.amount.toLocaleString()} 元
              </p>
              <p className="text-sm text-gray-500">
                建立時間：{q.createdAt.toDate().toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded"
          onClick={() => alert("匯出PDF功能待完成（預留）")}
        >
          匯出報價單 PDF
        </button>
      </div>
    </div>
  );
}
