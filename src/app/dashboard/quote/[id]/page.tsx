// app/dashboard/quote/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getQuoteById, updateQuoteItems } from "@/libs/quote";
import html2pdf from "html2pdf.js";

type Item = {
  name: string;
  unit: string;
  quantity: number;
  price: number;
  category: string;
  length?: number;
  width?: number;
  days?: number; // 🔥 新增：施工天數
};

const categories = [
  "木作工程",
  "水電工程",
  "油漆工程",
  "泥作工程",
  "空調工程",
  "其他",
];

function calculateArea(length: number, width: number, unit: string) {
  const areaInCm2 = length * width;
  if (unit === "坪") {
    return +(areaInCm2 / 33057).toFixed(2);
  }
  if (unit === "才") {
    return +(areaInCm2 / 900).toFixed(2);
  }
  if (unit === "公尺²") {
    return +(areaInCm2 / 10000).toFixed(2);
  }
  return 0;
}

// 自動產生報價單編號
function generateQuoteNumber() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(100 + Math.random() * 900); // 三位隨機數
  return `Q-${yyyy}${mm}${dd}-${random}`;
}

export default function QuoteDetailPage() {
  const { id } = useParams();
  const [items, setItems] = useState<Item[]>([]);
  const [quoteTitle, setQuoteTitle] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [quoteNumber, setQuoteNumber] = useState("");

  useEffect(() => {
    async function fetchQuote() {
      const data = await getQuoteById(id as string);
      if (data) {
        setQuoteTitle(data.title || "");
        setItems(data.items || []);
        setCustomerName(data.customerName || "");
        setCustomerPhone(data.customerPhone || "");
        setCustomerAddress(data.customerAddress || "");
        setQuoteNumber(data.quoteNumber || generateQuoteNumber());
      }
    }
    fetchQuote();
  }, [id]);

  const handleItemChange = (index: number, field: keyof Item, value: string) => {
    const newItems = [...items];
    if (field === "quantity" || field === "price" || field === "days") {
      newItems[index][field] = parseFloat(value) || 0;
    } else {
      newItems[index][field] = value;
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      { name: "", unit: "", quantity: 0, price: 0, category: "其他", days: 0 },
    ]);
  };

  const saveItems = async () => {
    await updateQuoteItems(id as string, {
      items,
      customerName,
      customerPhone,
      customerAddress,
      quoteNumber,
    });
    alert("✅ 已儲存細項與客戶資訊到 Firestore！");
  };

  const exportPDF = (mode: "初估版" | "正式版") => {
    const element = document.getElementById("pdf-content");
    if (!element) return;

    if (mode === "初估版") {
      element.classList.add("initial-estimate-mode");
    } else {
      element.classList.remove("initial-estimate-mode");
    }

    const opt = {
      margin: 0.5,
      filename: `${quoteTitle}_${mode}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const totalDays = items.reduce((sum, item) => sum + (item.days || 0), 0);

  const categoryTotals = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = 0;
    acc[item.category] += item.quantity * item.price;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">報價單內容</h2>
      <p className="text-gray-600">報價單 ID：{id}</p>
      <p className="text-gray-700 font-medium">報價單標題：{quoteTitle}</p>
      <p className="text-gray-700 mb-6">報價單編號：{quoteNumber}</p>

      <div className="flex gap-4">
        <button
          onClick={addItem}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          ➕ 新增細項
        </button>
        <button
          onClick={saveItems}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          💾 儲存細項
        </button>
        <button
          onClick={() => exportPDF("初估版")}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          📄 匯出初估版 PDF
        </button>
        <button
          onClick={() => exportPDF("正式版")}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          📜 匯出正式版 PDF
        </button>
      </div>

      {/* 匯出 PDF 區塊 */}
      <div id="pdf-content" className="p-8 bg-white space-y-6">
        {/* 公司 LOGO */}
        <div className="text-center mb-6">
          <img src="/logo.png" alt="公司 LOGO" className="h-16 mx-auto" />
        </div>

        {/* 客戶資料區 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div>
            <label className="text-sm text-gray-600">客戶名稱</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="輸入客戶名稱"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">客戶電話</label>
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="輸入客戶電話"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">客戶地址</label>
            <input
              type="text"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="輸入客戶地址"
            />
          </div>
        </div>

        {/* 報價單標題＋編號 */}
        <h3 className="text-xl font-semibold mb-2">{quoteTitle}</h3>
        <p className="text-gray-600 mb-6">報價單編號：{quoteNumber}</p>

        {/* 細項列表 */}
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-10 gap-4 items-center bg-gray-50 p-4 rounded"
            >
              <input
                type="text"
                placeholder="項目名稱"
                value={item.name}
                onChange={(e) => handleItemChange(index, "name", e.target.value)}
                className="col-span-1 border p-2 rounded"
              />
              <input
                type="text"
                placeholder="單位"
                value={item.unit}
                onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                className="col-span-1 border p-2 rounded"
              />
              <input
                type="number"
                placeholder="長度(cm)"
                value={item.length ?? ""}
                onChange={(e) => {
                  const length = parseFloat(e.target.value) || 0;
                  const width = item.width || 0;
                  const quantity = calculateArea(length, width, item.unit);
                  const updated = { ...item, length, quantity };
                  setItems((prev) => {
                    const newItems = [...prev];
                    newItems[index] = updated;
                    return newItems;
                  });
                }}
                className="col-span-1 border p-2 rounded"
              />
              <input
                type="number"
                placeholder="寬度(cm)"
                value={item.width ?? ""}
                onChange={(e) => {
                  const width = parseFloat(e.target.value) || 0;
                  const length = item.length || 0;
                  const quantity = calculateArea(length, width, item.unit);
                  const updated = { ...item, width, quantity };
                  setItems((prev) => {
                    const newItems = [...prev];
                    newItems[index] = updated;
                    return newItems;
                  });
                }}
                className="col-span-1 border p-2 rounded"
              />
              <input
                type="number"
                placeholder="數量"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                className="col-span-1 border p-2 rounded"
              />
              <input
                type="number"
                placeholder="單價"
                value={item.price}
                onChange={(e) => handleItemChange(index, "price", e.target.value)}
                className="col-span-1 border p-2 rounded"
              />
              <input
                type="number"
                placeholder="施工天數"
                value={item.days ?? ""}
                onChange={(e) => handleItemChange(index, "days", e.target.value)}
                className="col-span-1 border p-2 rounded"
              />
              <select
                value={item.category}
                onChange={(e) => handleItemChange(index, "category", e.target.value)}
                className="col-span-1 border p-2 rounded"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="col-span-1 text-right font-semibold">
                ${(item.quantity * item.price).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* 總金額與分類統計 */}
        <div className="mt-8 text-right text-xl font-bold text-blue-700">
          總計金額：${total.toLocaleString()}
        </div>

        {/* 工程總施工天數 */}
        <div className="mt-4 text-right text-lg font-semibold text-green-600">
          預估總施工天數：{totalDays} 天
        </div>

        {/* 分類金額統計表 */}
        <div className="mt-10">
          <h3 className="text-lg font-bold mb-4">分類金額統計</h3>
          <div className="space-y-2">
            {Object.entries(categoryTotals).map(([category, amount]) => (
              <div
                key={category}
                className="flex justify-between bg-white p-3 rounded shadow"
              >
                <span className="font-semibold">{category}</span>
                <span className="font-bold text-blue-700">
                  ${amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 條款與簽名區（只在正式版顯示） */}
        <div className="mt-10 hidden initial-estimate-mode:hidden">
          <h3 className="text-lg font-bold mb-2">條款說明</h3>
          <p className="text-gray-600 text-sm mb-6">
            本報價單內容為雙方洽談之依據，經正式簽約後生效。若有變更，雙方應以書面協議為準。
          </p>

          <div className="mt-6 space-y-4 text-gray-700 text-sm">
            <p>● 本報價單有效期限為30日，逾期需重新議價。</p>
            <p>● 簽約後，若因施工需求調整項目，雙方應協議另訂追加或變更價格。</p>
            <p>● 本公司保留最終修改與解釋之權利。</p>
          </div>

          <div className="mt-10">
            <p>客戶簽名：_____________________</p>
            <p>日期：__________________________</p>
          </div>
        </div>
      </div> {/* 關閉 #pdf-content */}
    </div> {/* 關閉外層 page container */}
  );
}
