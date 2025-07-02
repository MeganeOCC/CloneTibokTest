"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Don't apply this layout to login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">TIBOK Admin</h2>
          </div>
          
          <nav className="p-4 space-y-2">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                NAVIGATION
              </p>
              <Link href="/admin" className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                Dashboard
              </Link>
              <Link href="/admin/pharmacies" className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                Pharmacies
              </Link>
              <Link href="/admin/doctors" className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                Médecins
              </Link>
              <Link href="/admin/deliveries" className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                Livraisons n8n
              </Link>
              <Link href="/admin/clients" className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                Interfaces Clients
              </Link>
              <Link href="/admin/monitoring" className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                Monitoring
              </Link>
              <Link href="/admin/analytics" className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                Analytics
              </Link>
            </div>
            
            <div className="space-y-1 pt-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                SYSTÈME
              </p>
              <Link href="/admin/workflows" className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                Workflows n8n
              </Link>
              <Link href="/admin/settings" className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                Paramètres
              </Link>
              <Link href="/admin/logs" className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                Logs Système
              </Link>
            </div>
          </nav>
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">TIBOK Admin Center</h1>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Système en ligne</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">FR</button>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded">EN</button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">A</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Admin TIBOK</span>
                </div>
              </div>
            </div>
          </header>
          
          {/* Page content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
