export default function Header({ title, setSidebarOpen }) {
  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
      <button
        className="md:hidden text-gray-700"
        onClick={() => setSidebarOpen(true)}
      >
        ☰
      </button>
    </header>
  );
}
