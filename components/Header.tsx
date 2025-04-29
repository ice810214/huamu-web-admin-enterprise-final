// components/Header.tsx
export default function Header({ title }: { title: string }) {
    return (
      <header className="w-full py-4 px-6 bg-gray-100 border-b">
        <h1 className="text-xl font-bold">{title}</h1>
      </header>
    );
  }
  