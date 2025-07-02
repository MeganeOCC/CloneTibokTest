"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Médecins", href: "/admin/doctors", icon: "👨‍⚕️" },
    { name: "Utilisateurs", href: "/admin/users", icon: "👥" },
    { name: "Pharmacies", href: "/admin/pharmacies", icon: "🏥" },
    { name: "Commandes", href: "/admin/orders", icon: "📦" },
  ];

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
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-100 text-blue-900"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.name}
                    </div>
                  </Link>
                );
              })}
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
