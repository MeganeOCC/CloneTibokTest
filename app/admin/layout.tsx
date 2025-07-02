"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useLanguage } from "@/contexts/language-context"
import { translations, type TranslationKey } from "@/lib/translations"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  UserPlus,
  Package,
  TrendingUp,
  Workflow,
  Settings,
  FileText,
  LogOut,
  Bell,
  User,
  Monitor,
  BarChart3
} from "lucide-react"

const getTranslation = (lang: any, key: TranslationKey) => {
  return translations[lang][key] || translations["en"][key] || key
}

const AdminSidebar = () => {
  const { language } = useLanguage()
  const t = (key: TranslationKey) => getTranslation(language, key)
  
  const navigationItems = [
    { 
      label: t("adminNavDashboard"), 
      href: "/admin", 
      icon: LayoutDashboard,
      section: "main"
    },
    { 
      label: t("adminNavUsers"), 
      href: "/admin/users", 
      icon: Users,
      section: "main"
    },
    { 
      label: t("adminNavPharmacies"), 
      href: "/admin/pharmacies", 
      icon: Building2,
      section: "main"
    },
    { 
      label: t("adminNavDoctors"), 
      href: "/admin/doctors", 
      icon: UserPlus,
      section: "main"
    },
    { 
      label: t("adminNavOrders"), 
      href: "/admin/orders", 
      icon: Package,
      section: "main"
    },
    { 
      label: t("adminNavInterfaces"), 
      href: "/admin/interfaces", 
      icon: Users,
      section: "main"
    },
    { 
      label: t("adminNavMonitoring"), 
      href: "/admin/monitoring", 
      icon: Monitor,
      section: "main"
    },
    { 
      label: t("adminNavAnalytics"), 
      href: "/admin/analytics", 
      icon: BarChart3,
      section: "main"
    },
    { 
      label: t("adminNavWorkflows"), 
      href: "/admin/workflows", 
      icon: Workflow,
      section: "system"
    },
    { 
      label: t("adminNavSettings"), 
      href: "/admin/settings", 
      icon: Settings,
      section: "system"
    },
    { 
      label: t("adminNavLogs"), 
      href: "/admin/logs", 
      icon: FileText,
      section: "system"
    }
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">TIBOK Admin</h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            NAVIGATION
          </p>
          {navigationItems.filter(item => item.section === "main").map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors">
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </div>
            </Link>
          ))}
        </div>
        
        <div className="space-y-1 pt-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            SYSTÈME
          </p>
          {navigationItems.filter(item => item.section === "system").map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors">
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}

const AdminTopBar = () => {
  const { language, setLanguage } = useLanguage()
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()
  
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  return (
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
            <Button
              variant={language === "fr" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("fr")}
              className={language === "fr" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              FR
            </Button>
            <Button
              variant={language === "en" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("en")}
              className={language === "en" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              EN
            </Button>
          </div>
          
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Admin TIBOK</span>
          </div>
          
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Déconnexion</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/admin/login")
        return
      }

      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        router.push("/admin/login")
        return
      }

      setIsAuthenticated(true)
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push("/admin/login")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg">Chargement...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminTopBar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
