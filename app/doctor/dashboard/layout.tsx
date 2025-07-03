"use client"

import type React from "react"
import { useState, useEffect, type ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useLanguage, type Language } from "@/contexts/language-context"
import { translations, type TranslationKey } from "@/lib/translations"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  HeartPulse,
  LayoutDashboard,
  Video,
  FileText,
  Users,
  MessageSquare,
  UserCircle,
  FileSignature,
  LineChart,
  Menu,
  Sun,
  Moon,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

const getTranslation = (lang: Language, key: TranslationKey) => {
  return translations[lang]?.[key] || translations["en"]?.[key] || String(key)
}

interface NavItem {
  href: string
  icon: React.ElementType
  labelKey: TranslationKey
  badge?: number
}

export default function DoctorDashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const { language, setLanguage } = useLanguage()
  const t = (key: TranslationKey) => getTranslation(language, key)
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const supabase = getSupabaseBrowserClient()
  
  // Doctor profile state
  const [doctorName, setDoctorName] = useState<string>("")
  const [doctorSpecialty, setDoctorSpecialty] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeDoctor()
    
    // Set doctor offline when they close the tab/window
    const handleBeforeUnload = () => {
      updateDoctorStatus('offline')
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  const initializeDoctor = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/doctor')
        return
      }

      // Set doctor status to online
      await updateDoctorStatus('online')
      
      // Fetch doctor profile
      await fetchDoctorProfile()
    } catch (error) {
      console.error('Error initializing doctor:', error)
      router.push('/doctor')
    }
  }

  const updateDoctorStatus = async (status: 'online' | 'offline' | 'consultation') => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      const { error } = await supabase
        .from('doctors')
        .update({ 
          status: status,
          last_seen: new Date().toISOString()
        })
        .eq('user_id', user.id)
      
      if (error) {
        console.error('Error updating doctor status:', error)
      }
    } catch (error) {
      console.error('Error in updateDoctorStatus:', error)
    }
  }

  useEffect(() => {
    // Update specialty text when language changes
    if (!doctorSpecialty || doctorSpecialty === "Médecin Généraliste" || doctorSpecialty === "General Practitioner") {
      setDoctorSpecialty(language === 'fr' ? 'Médecin Généraliste' : 'General Practitioner')
    }
  }, [language])

  const fetchDoctorProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/doctor')
        return
      }

      // For the known doctor email, set the name directly
      if (user.email === 'customer.service@obesity-care-clinic.com') {
        setDoctorName('Dr. Raoul Rivet')
        setDoctorSpecialty(language === 'fr' ? 'Médecin Généraliste' : 'General Practitioner')
      } else {
        // For other doctors, extract from email or use a default
        const nameFromEmail = user.email?.split('@')[0].replace(/\./g, ' ') || 'Doctor'
        setDoctorName(`Dr. ${nameFromEmail}`)
        setDoctorSpecialty(language === 'fr' ? 'Médecin Généraliste' : 'General Practitioner')
      }
    } catch (error) {
      console.error('Error fetching doctor profile:', error)
      setDoctorName('Dr. Doctor') // Fallback
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await updateDoctorStatus('offline') // Set status to offline before logging out
    await supabase.auth.signOut()
    router.push('/doctor')
  }

  const navItems: NavItem[] = [
    { href: "/doctor/dashboard", icon: LayoutDashboard, labelKey: "doctorDashboardNavDashboard" },
    { href: "/doctor/dashboard/video-consultation", icon: Video, labelKey: "doctorDashboardNavVideoConsultation" },
    { href: "/doctor/dashboard/ai-prescriptions", icon: FileText, labelKey: "doctorDashboardNavAIPrescriptions" },
    { href: "/doctor/dashboard/patient-records", icon: Users, labelKey: "doctorDashboardNavPatientRecords" },
    { href: "/doctor/dashboard/chat", icon: MessageSquare, labelKey: "doctorDashboardNavPatientChat", badge: 3 },
    { href: "/doctor/dashboard/profile", icon: UserCircle, labelKey: "doctorDashboardNavMyProfile" },
    { href: "/doctor/dashboard/ai-reports", icon: FileSignature, labelKey: "doctorDashboardNavAIReports" },
    { href: "/doctor/dashboard/performance", icon: LineChart, labelKey: "doctorDashboardNavPerformance" },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Link href="/doctor/dashboard" className="flex items-center space-x-3">
          <HeartPulse className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-blue-600">TIBOK</span>
        </Link>
        <p className="text-sm text-gray-500 mt-1">{t("doctorDashboardTitle")}</p>
      </div>
      <nav className="flex-grow p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.labelKey}
            href={item.href}
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "flex items-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group",
              pathname === item.href
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-400"
                : "text-gray-700 dark:text-gray-300",
            )}
          >
            <item.icon className="h-5 w-5 mr-3 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
            <span className="flex-1">{t(item.labelKey)}</span>
            {item.badge && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{item.badge}</span>
            )}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {language === 'fr' ? 'Déconnexion' : 'Logout'}
        </Button>
      </div>
    </div>
  )

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-lg">{language === 'fr' ? 'Chargement...' : 'Loading...'}</div>
    </div>
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg hidden md:block fixed h-full">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-white dark:bg-gray-800">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-md border-b-2 border-blue-600 dark:border-blue-500">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setMobileMenuOpen(true)}>
                  <Menu className="h-6 w-6" />
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Button
                    variant={language === "fr" ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "px-3 py-1 text-sm",
                      language === "fr" ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-300",
                    )}
                    onClick={() => setLanguage("fr")}
                  >
                    FR
                  </Button>
                  <Button
                    variant={language === "en" ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "px-3 py-1 text-sm",
                      language === "en" ? "bg-blue-600 text-white" : "text-gray-600 dark:text-gray-300",
                    )}
                    onClick={() => setLanguage("en")}
                  >
                    EN
                  </Button>
                </div>

                <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                  {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <span className="sr-only">Toggle theme</span>
                </Button>

                <div className="flex items-center space-x-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg?width=40&height=40" alt="Doctor Avatar" />
                    <AvatarFallback>
                      {doctorName ? doctorName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'DR'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {doctorName || t("doctorDashboardDoctorNamePlaceholder")}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {doctorSpecialty}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 dark:text-green-400">{t("doctorDashboardStatusOnline")}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
