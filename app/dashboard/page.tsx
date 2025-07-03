"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { translations, type TranslationKey } from "@/lib/translations"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Video,
  UserIcon as UserMd,
  Pill,
  Bot,
  Clock,
  Download,
  Share,
  CreditCard,
  Send,
  Heart,
  Check,
  Wifi,
  VideoOff,
  MicOff,
  Mic,
  PhoneCall,
  Stethoscope,
  AlertTriangle,
  Lightbulb,
  Camera,
  Volume2,
  Play,
  Loader2,
  ClipboardList,
  UploadCloud,
  FlaskConical,
  SearchIcon,
  Info,
  ShieldCheck,
  Phone,
  Mail,
  MessageSquare,
  XIcon as XRay,
  FileIcon as FileMedical,
  CheckCircle,
  Paperclip,
  Hospital,
  MapPin,
  MessageCircleIcon,
  Thermometer,
  Lock,
  BotIcon as Robot,
  ArrowLeft,
  HistoryIcon,
  EllipsisVertical,
  Eye,
  LineChart,
  CalendarCheck,
  StickyNoteIcon as NotesMedical,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import type { CoreMessage } from "ai"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  type ChartData,
  type ChartOptions,
} from "chart.js"
import { Line } from "react-chartjs-2"
import { Skeleton } from "@/components/ui/skeleton"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale)

// --- Your Mock User Data (no familyMembers array) ---
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
  waitingRoomData: {
    connectionStatus: "connected",
    connectionMessageKey: "connection-message" as TranslationKey,
    doctors: [
      {
        id: "dubois",
        name: "Dr. Martin Dubois",
        specialtyKey: "doctor1-specialty" as TranslationKey,
        statusKey: "waitingRoomDoctorAvailable" as TranslationKey,
        waitTime: "~5",
        queueCount: 2,
        icon: UserMd,
        color: "blue",
      },
      {
        id: "laurent",
        name: "Dr. Sophie Laurent",
        specialtyKey: "doctor2-specialty" as TranslationKey,
        statusKey: "waitingRoomDoctorBusy" as TranslationKey,
        waitTime: "~12",
        queueCount: 4,
        icon: UserMd,
        color: "purple",
      },
      {
        id: "patel",
        name: "Dr. Ahmed Patel",
        specialtyKey: "waitingRoomPediatrics" as TranslationKey,
        statusKey: "waitingRoomDoctorAvailable" as TranslationKey,
        waitTime: "~3",
        queueCount: 1,
        icon: Stethoscope,
        color: "green",
      },
      {
        id: "rousseau",
        name: "Dr. Marie Rousseau",
        specialtyKey: "waitingRoomCardiology" as TranslationKey,
        statusKey: "waitingRoomDoctorAvailable" as TranslationKey,
        waitTime: "~8",
        queueCount: 0,
        price: "1500 MUR",
        icon: Heart,
        color: "orange",
      },
    ],
    userQueuePosition: null as number | null,
    estimatedUserWaitTime: null as string | null,
    liveQueue: [
      {
        id: "p1",
        nameKey: "patient1" as TranslationKey,
        statusKey: "waitingRoomInConsultation" as TranslationKey,
        position: 1,
        color: "blue",
      },
      {
        id: "p2",
        nameKey: "patient2" as TranslationKey,
        statusKey: "waitingRoomWaiting" as TranslationKey,
        position: 2,
        color: "yellow",
      },
    ],
  },
  pharmacyData: {
    prescription: {
      date: "15 Décembre 2024",
      doctor: "Dr. Patel",
      statusKey: "pharmacyStatusProcessing" as TranslationKey,
      items: [
        {
          nameKey: "pharmacyMedicationParacetamol" as TranslationKey,
          dosageKeyFR: "pharmacyMedicationParacetamolDosageFR",
          dosageKeyEN: "pharmacyMedicationParacetamolDosageEN",
        },
        {
          nameKey: "pharmacyMedicationAmoxicillin" as TranslationKey,
          dosageKeyFR: "pharmacyMedicationAmoxicillinDosageFR",
          dosageKeyEN: "pharmacyMedicationAmoxicillinDosageEN",
        },
        {
          nameKey: "pharmacyMedicationCoughSyrup" as TranslationKey,
          dosageKeyFR: "pharmacyMedicationCoughSyrupDosageFR",
          dosageKeyEN: "pharmacyMedicationCoughSyrupDosageEN",
        },
      ],
    },
    selectedPharmacy: {
      nameKey: "pharmacySelectedPharmacyName" as TranslationKey,
      addressKey: "pharmacySelectedPharmacyAddress" as TranslationKey,
      allMedsAvailableKeyFR: "pharmacyAllMedsAvailableFR",
      allMedsAvailableKeyEN: "pharmacyAllMedsAvailableEN",
      prepTimeKeyFR: "pharmacyPreparationTimeFR",
      prepTimeKeyEN: "pharmacyPreparationTimeEN",
      statusKey: "pharmacyStatusSelectedFR" as TranslationKey,
    },
    processSteps: [
      {
        id: 1,
        titleKeyFR: "pharmacyStep1TitleFR",
        titleKeyEN: "pharmacyStep1TitleEN",
        descKeyFR: "pharmacyStep1DescFR",
        descKeyEN: "pharmacyStep1DescEN",
        status: "completed",
        time: "14:32",
      },
      {
        id: 2,
        titleKeyFR: "pharmacyStep2TitleFR",
        titleKeyEN: "pharmacyStep2TitleEN",
        descKeyFR: "pharmacyStep2DescFR",
        descKeyEN: "pharmacyStep2DescEN",
        status: "active",
        timeKeyFR: "pharmacyStepStatusInProgressFR",
        timeKeyEN: "pharmacyStepStatusInProgressEN",
      },
      {
        id: 3,
        titleKeyFR: "pharmacyStep3TitleFR",
        titleKeyEN: "pharmacyStep3TitleEN",
        descKeyFR: "pharmacyStep3DescFR",
        descKeyEN: "pharmacyStep3DescEN",
        status: "waiting",
      },
      {
        id: 4,
        titleKeyFR: "pharmacyStep4TitleFR",
        titleKeyEN: "pharmacyStep4TitleEN",
        descKeyFR: "pharmacyStep4DescFR",
        descKeyEN: "pharmacyStep4DescEN",
        status: "waiting",
      },
      {
        id: 5,
        titleKeyFR: "pharmacyStep5TitleFR",
        titleKeyEN: "pharmacyStep5TitleEN",
        descKeyFR: "pharmacyStep5DescFR",
        descKeyEN: "pharmacyStep5DescEN",
        status: "waiting",
      },
    ],
    estimate: {
      medicationsAmount: "~850 MUR",
      prepFees: "50 MUR",
      deliveryKeyFR: "pharmacyEstimateDeliveryFreeSoloFR",
      deliveryKeyEN: "pharmacyEstimateDeliveryFreeSoloEN",
      totalAmount: "~900 MUR",
      statusKeyFR: "pharmacyAwaitingFinalQuoteFR",
      statusKeyEN: "pharmacyAwaitingFinalQuoteEN",
    },
    notifications: [
      {
        type: "success",
        messageKeyFR: "pharmacyNotifPrescriptionSentFR",
        messageKeyEN: "pharmacyNotifPrescriptionSentEN",
        time: "14:32 - Pharmacie Central Plus",
      },
      {
        type: "info",
        messageKeyFR: "pharmacyNotifQuoteInProgressFR",
        messageKeyEN: "pharmacyNotifQuoteInProgressEN",
        detailsKeyFR: "pharmacyNotifQuoteInProgressDescFR",
        detailsKeyEN: "pharmacyNotifQuoteInProgressDescEN",
      },
    ],
  },
  medicalHistory: [
    {
      id: "consult1",
      type: "consultation",
      titleKey: "historyConsultationGPTitle" as TranslationKey,
      date: "15 Novembre 2024",
      time: "14:30",
      statusKey: "historyStatusCompleted" as TranslationKey,
      statusColor: "bg-green-500",
      borderColor: "border-blue-500",
      iconColor: "text-blue-500",
      doctorName: "Dr. Marie Dubois",
      doctorSpecialtyKey: "historyDoctorSpecialtyGP" as TranslationKey,
      reasonKey: "historyReasonCoughFatigue" as TranslationKey,
      summaryIcon: StickyNoteIcon as any,
      summaryTitleKey: "historyMedicalSummaryTitle" as TranslationKey,
      summaryTextKey: "historySummaryTextConsult1" as TranslationKey,
      diagnoses: [{ textKey: "historyDiagnosisPostViral" as TranslationKey, icon: Stethoscope, color: "bg-yellow-500" }],
      recommendationsKey: "historyRecommendationsConsult1" as TranslationKey,
      hasPrescription: true,
      actions: [
        { type: "viewDetails", labelKey: "historyActionViewDetails" as TranslationKey },
        { type: "downloadPDF", labelKey: "historyActionDownloadPDF" as TranslationKey },
        { type: "share", labelKey: "historyActionShare" as TranslationKey },
      ],
    },
    // ...more medicalHistory entries as in your current file...
  ],
}

// ...(interfaces, components for upload, etc. unchanged, as in your current file)...

export default function DashboardPageContent({
  activeTab: activeTabFromLayout,
  currentUser,
  isLoadingUser,
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tabFromQuery = searchParams.get("tab")
  const activeTab = activeTabFromLayout || tabFromQuery || "dashboard"
  const { language, setLanguage } = useLanguage()
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

  // ... all your other state and handlers as in your current file...

  // ---- CLEANED MAIN DASHBOARD TAB, NO FAMILY ----
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        const dashboardDisplayName = isLoadingUser
          ? ""
          : currentUser
            ? [currentUser.firstName, currentUser.lastName].filter(Boolean).join(" ") ||
              (currentUser as any).fullName ||
              (currentUser as any).name ||
              currentUser.email?.split("@")[0] ||
              t("dashboardDefaultUserName" as TranslationKey)
            : t("dashboardDefaultUserName" as TranslationKey)

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
      // ---- REMOVE THE "family" CASE ----

      // The rest of your cases for: waiting-room, second-opinion, pharmacy, tibot, history...
      // Paste those from your original code unchanged (do not paste the family case or anything with familyMembers!)

      // EXAMPLE:
      case "waiting-room":
        // ... paste your waiting-room code here ...
        break;
      case "second-opinion":
        // ... paste your second-opinion code here ...
        break;
      case "pharmacy":
        // ... paste your pharmacy code here ...
        break;
      case "tibot":
        // ... paste your tibot code here ...
        break;
      case "history":
        // ... paste your history code here ...
        break;
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
