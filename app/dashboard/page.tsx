"use client"

import React, { useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { translations, type TranslationKey } from "@/lib/translations"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Video,
  UserIcon as UserMd,
  Pill,
  Bot,
  Heart,
  Loader2,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const mockUser = {
  name: "Marie Dubois",
  plan: "pricingSoloPackTitle",
  consultationsRemaining: 3,
  stats: {
    consultations: "3/4",
    prescriptions: 2,
    secondOpinions: 1,
    deliveries: 5,
  },
}

export default function DashboardPageContent({
  activeTab: activeTabFromLayout,
  currentUser,
  isLoadingUser,
}) {
  const searchParams = useSearchParams()
  const tabFromQuery = searchParams.get("tab")
  const activeTab = activeTabFromLayout || tabFromQuery || "dashboard"
  const { language } = useLanguage()
  const t = useCallback(
    (key, params) => {
      let translation = translations[language][key] || key
      if (params) {
        Object.keys(params).forEach((paramKey) => {
          translation = translation.replace(`{${paramKey}}`, String(params[paramKey]))
        })
      }
      return translation
    },
    [language],
  )

  // Helper: display name logic
  const dashboardDisplayName = isLoadingUser
    ? ""
    : currentUser
      ? [currentUser.firstName, currentUser.lastName].filter(Boolean).join(" ") ||
        (currentUser as any).fullName ||
        (currentUser as any).name ||
        currentUser.email?.split("@")[0] ||
        t("dashboardDefaultUserName" as TranslationKey)
      : t("dashboardDefaultUserName" as TranslationKey)

  // === Section Rendering ===
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {isLoadingUser ? (
                  <Skeleton className="h-7 w-52 inline-block" />
                ) : (
                  <>
                    {t("dashboardWelcome")} {dashboardDisplayName}
                  </>
                )}
              </h1>
              <p className="text-gray-600">{t("dashboardSubtitle")}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { labelKey: "statConsultations", value: mockUser.stats.consultations, icon: Video, color: "blue" },
                { labelKey: "statPrescriptions", value: mockUser.stats.prescriptions.toString(), icon: Pill, color: "green" },
                { labelKey: "statSecondOpinions", value: mockUser.stats.secondOpinions.toString(), icon: UserMd, color: "purple" },
                { labelKey: "statDeliveries", value: mockUser.stats.deliveries.toString(), icon: Heart, color: "orange" },
              ].map((stat) => (
                <Card key={stat.labelKey} className="shadow-md">
                  <CardContent className="p-6 flex items-center">
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center mr-4`}>
                      <stat.icon className={`text-${stat.color}-600`} size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{t(stat.labelKey)}</p>
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  titleKey: "quickActionImmediateConsultation",
                  descKey: "quickActionJoinWaitingRoom",
                  buttonKey: "quickActionStart",
                  icon: Video,
                  color: "blue",
                  targetTab: "waiting-room",
                },
                {
                  titleKey: "quickActionRequestSecondOpinion",
                  descKey: "quickActionConsultSpecialist",
                  buttonKey: "quickActionStartRequest",
                  icon: UserMd,
                  color: "purple",
                  targetTab: "second-opinion",
                },
                {
                  titleKey: "quickActionTibotAssistant",
                  descKey: "quickActionChatWithAI",
                  buttonKey: "quickActionChat",
                  icon: Bot,
                  color: "green",
                  targetTab: "tibot",
                },
              ].map((action) => (
                <Card key={action.titleKey} className="shadow-md text-center">
                  <CardContent className="p-6">
                    <div
                      className={`w-16 h-16 bg-${action.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <action.icon className={`text-${action.color}-600`} size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t(action.titleKey)}</h3>
                    <p className="text-gray-600 text-sm mb-4">{t(action.descKey)}</p>
                    <Link href={`/dashboard?tab=${action.targetTab}`} passHref>
                      <Button className={`w-full bg-${action.color}-600 hover:bg-${action.color}-700`}>
                        {t(action.buttonKey)}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "waiting-room":
        return <div style={{fontSize:20,marginTop:40}}>Salle d'attente (aucune logique famille)</div>

      case "second-opinion":
        return <div style={{fontSize:20,marginTop:40}}>Second avis (aucune logique famille)</div>

      case "pharmacy":
        return <div style={{fontSize:20,marginTop:40}}>Pharmacie (aucune logique famille)</div>

      case "tibot":
        return <div style={{fontSize:20,marginTop:40}}>TiBot IA (aucune logique famille)</div>

      case "history":
        return <div style={{fontSize:20,marginTop:40}}>Historique (aucune logique famille)</div>

      default:
        return <div>{t("navDashboard")} Content</div>
    }
  }

  return (
    <React.Suspense
      fallback={
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      {renderContent()}
    </React.Suspense>
  )
}
