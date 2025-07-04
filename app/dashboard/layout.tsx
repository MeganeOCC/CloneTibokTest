"use client"

import React, { useState, useEffect, type ReactNode } from "react"
import Link from "next/link"
import {
  HeartPulse,
  Bell,
  UserCircle,
  LayoutDashboard,
  Video,
  UserIcon as UserMd,
  Pill,
  Bot,
  History,
  Crown,
  ChevronDown,
  LogOut,
  Settings,
} from "lucide-react"
import LanguageSwitcher from "@/components/language-switcher"
import { useLanguage } from "@/contexts/language-context"
import { useRouter } from "next/navigation"
import { translations, type TranslationKey } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"

interface NavItem {
  id: string
  labelKey: TranslationKey
  icon: React.ElementType
  live?: boolean
  requiresSubscription?: boolean // Add this to control access
}

interface UserProfile {
  id: string
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
  email: string | undefined
  planNameKey?: TranslationKey | null
  consultationsRemaining?: number | null
  subscriptionType?: 'pay_per_use' | 'solo' | null // Add this
  subscriptionData?: any // Add full subscription data
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { language } = useLanguage()
  const t = translations[language]
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  // Dynamic nav items based on subscription
  const getNavItems = (subscriptionType: string | null): NavItem[] => {
    const baseItems: NavItem[] = [
      { id: "dashboard", labelKey: "navDashboard", icon: LayoutDashboard },
      { id: "waiting-room", labelKey: "navWaitingRoom", icon: Video, live: true },
      { id: "second-opinion", labelKey: "navSecondOpinion", icon: UserMd },
      { id: "pharmacy", labelKey: "navPharmacy", icon: Pill },
    ]
    
    // Only add TiBot for solo subscription
    if (subscriptionType === 'solo') {
      baseItems.push({ id: "tibot", labelKey: "navTibotAI", icon: Bot, requiresSubscription: true })
    }
    
    baseItems.push({ id: "history", labelKey: "navHistory", icon: History })
    
    return baseItems
  }

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoadingUser(true)
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        setIsLoadingUser(false)
        return
      }

      // Fetch profile data
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single()

      // Fetch patient data
      const { data: patient } = await supabase
        .from("patients")
        .select("id, first_name, last_name")
        .eq("user_id", user.id)
        .single()

      let subscriptionType: 'pay_per_use' | 'solo' | null = 'pay_per_use'
      let subscriptionData = null
      let consultationsRemaining = 0

      if (patient) {
        // Fetch active subscription
        const { data: subscription } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("patient_id", patient.id)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (subscription) {
          subscriptionType = subscription.subscription_type as 'pay_per_use' | 'solo'
          subscriptionData = subscription
          consultationsRemaining = subscription.subscription_type === 'solo' 
            ? (subscription.consultations_limit || 1) - subscription.consultations_used 
            : 0
        }
      }

      // Determine plan name key based on subscription
      let planNameKey: TranslationKey | null = null
      if (subscriptionType === 'solo') {
        planNameKey = "pricingSoloPackTitle"
      } else {
        planNameKey = patient?.is_local 
          ? "pricingPayPerUseLocalTitle" 
          : "pricingPayPerUseTouristTitle"
      }

      setCurrentUser({
        id: user.id,
        firstName: patient?.first_name || profile?.full_name?.split(' ')[0] || user.email?.split("@")[0] || "User",
        lastName: patient?.last_name || profile?.full_name?.split(' ')[1] || "",
        avatarUrl: null,
        email: user.email,
        planNameKey: planNameKey,
        consultationsRemaining: consultationsRemaining,
        subscriptionType: subscriptionType,
        subscriptionData: subscriptionData
      })

      setIsLoadingUser(false)
    }

    fetchUserData()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      if (event === "SIGNED_IN" || event === "USER_UPDATED" || event === "INITIAL_SESSION") {
        if (session?.user) {
          await fetchUserData()
        }
      } else if (event === "SIGNED_OUT") {
        setCurrentUser(null)
        router.push("/")
      }
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [supabase, router])

  const displayName = currentUser
    ? [currentUser.firstName, currentUser.lastName]
        .filter(Boolean)
        .join(" ") || currentUser.email?.split("@")[0] || "Utilisateur"
    : "Utilisateur"
    
  const avatarFallbackName = currentUser
    ? `${(currentUser.firstName || "U").charAt(0)}${(currentUser.lastName || "").charAt(0)}`
    : "U"

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setCurrentUser(null)
      setIsLoadingUser(false)
      router.push("/")
    }
  }

  const planDisplayKey = currentUser?.planNameKey || ("dashboardPlanDefault" as TranslationKey)
  const consultationsDisplay = currentUser?.consultationsRemaining ?? 0
  const navItems = getNavItems(currentUser?.subscriptionType || null)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <HeartPulse className="text-white text-xl" />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900">TIBOK</h1>
                  <p className="text-xs text-gray-500">{t.dashboardBaseline}</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-gray-700">
                <Bell size={20} />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
                <span className="sr-only">Notifications</span>
              </Button>
              {isLoadingUser ? (
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-20 hidden md:block" />
                </div>
              ) : currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 p-1 rounded-full">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={currentUser.avatarUrl || "/placeholder.svg?width=32&height=32&query=user+avatar"}
                          alt={displayName}
                        />
                        <AvatarFallback>{avatarFallbackName}</AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline text-sm font-medium text-gray-700">{displayName}</span>
                      <ChevronDown size={16} className="hidden md:inline text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>{displayName}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <UserCircle size={16} className="mr-2" />
                      Profil
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings size={16} className="mr-2" />
                      Paramètres
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut size={16} className="mr-2" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="outline" onClick={() => router.push("/auth/login")}>
                  Connexion
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-white shadow-sm fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-gray-200 hidden md:block">
          <nav className="mt-6">
            <div className="px-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                    <Crown size={20} />
                  </div>
                  <div className="ml-3">
                    {isLoadingUser ? (
                      <>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-32" />
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-gray-900">{t[planDisplayKey]}</p>
                        <p className="text-xs text-gray-500">
                          {currentUser?.subscriptionType === 'solo' 
                            ? `${consultationsDisplay} ${t.dashboardConsultationsRemaining}`
                            : t.dashboardPayPerUse || "Pay per use"
                          }
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-1 px-3">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/dashboard?tab=${item.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    setActiveTab(item.id)
                    window.history.pushState(null, "", `/dashboard?tab=${item.id}`)
                  }}
                  className={cn(
                    "flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors duration-150",
                    activeTab === item.id
                      ? "text-blue-600 bg-blue-50 border-r-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                  )}
                >
                  <item.icon size={18} className="mr-3" />
                  {t[item.labelKey]}
                  {item.live && (
                    <span className="ml-auto bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {t.navLive}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </nav>
        </aside>
        <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 mt-0">
          {React.cloneElement(children as React.ReactElement, { activeTab, currentUser, isLoadingUser })}
        </main>
      </div>
    </div>
  )
}
