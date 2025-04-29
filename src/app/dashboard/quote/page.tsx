"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getQuotes } from "@/libs/quote";

type Quote = {
  id: string;
  title: string;
  createdAt?: any;
};

export default function QuoteListPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    getQuotes().then(setQuotes);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">報價案件列表</h2>
        <Link
          href="/dashboard/quote/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ 新增報價單
        </Link>
      </div>

      <ul className="space-y-2">
        {quotes.map((quote) => (
          <li key={quote.id}>
            <Link
              href={`/dashboard/quote/${quote.id}`}
              className="block p-4 bg-white rounded shadow hover:bg-gray-50"
            >
              <div className="font-semibold">{quote.title}</div>
              <div className="text-sm text-gray-500">
                建立時間：{quote.createdAt?.toDate?.().toLocaleString?.() ?? "未提供"}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
