import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Roster Mechanic</h1>
        </div>
      </header>
      <main className="container mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
