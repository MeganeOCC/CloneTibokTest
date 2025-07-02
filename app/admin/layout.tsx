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

  const isActive = (path: string) => pathname === path;

  const mainNavigation = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Pharmacies", href: "/admin/pharmacies", icon: "🏥" },
    { name: "Médecins", href: "/admin/doctors", icon: "👨‍⚕️" },
    { name: "Livraisons n8n", href: "/admin/deliveries", icon: "🚚" },
    { name: "Interfaces Clients", href: "/admin/clients", icon: "👥" },
    { name: "Monitoring", href: "/admin/monitoring", icon: "📈" },
    { name: "Analytics", href: "/admin/analytics", icon: "📊" }
  ];

  const systemNavigation = [
    { name: "Workflows n8n", href: "/admin/workflows", icon: "🔧" },
    { name: "Paramètres", href: "/admin/settings", icon: "⚙️" },
    { name: "Logs Système", href: "/admin/logs", icon: "📄" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar with original design */}
        <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">TIBOK Admin</h2>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {/* Main Navigation */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                NAVIGATION
              </p>
              {mainNavigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive(item.href)
                        ? "bg-blue-100 text-blue-900"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <div className="w-5 h-5 mr-3 flex items-center justify-center">
                      <span className="text-sm">{item.icon}</span>
                    </div>
                    {item.name}
                  </div>
                </Link>
              ))}
            </div>
            
            {/* System Navigation */}
            <div className="space-y-1 pt-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                SYSTÈME
              </p>
              {systemNavigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive(item.href)
                        ? "bg-blue-100 text-blue-900"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <div className="w-5 h-5 mr-3 flex items-center justify-center">
                      <span className="text-sm">{item.icon}</span>
                    </div>
                    {item.name}
                  </div>
                </Link>
              ))}
            </div>
          </nav>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar with original design */}
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
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                    FR
                  </button>
                  <button className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                    EN
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">A</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Admin TIBOK</span>
                </div>
              </div>
            </div>
          </header>
          
          {/* Page content */}
          <main className="flex-1 overflow-y-auto bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
