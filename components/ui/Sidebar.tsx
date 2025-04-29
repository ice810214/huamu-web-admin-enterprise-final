// components/ui/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "報價模組", path: "/dashboard/quote" },
    { label: "驗收模組", path: "/dashboard/acceptance" },
    { label: "行事曆", path: "/dashboard/calendar" },
    { label: "帳號設定", path: "/dashboard/settings" },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r shadow-sm">
      <div className="p-4 text-xl font-bold">HUAMU</div>
      <nav className="flex flex-col space-y-2 px-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`py-2 px-3 rounded ${
              pathname.startsWith(item.path)
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
