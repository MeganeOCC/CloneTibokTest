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
  Users,
  Video,
  UserIcon as UserMd,
  Pill,
  Bot,
  Clock,
  Download,
  Share,
  Plus,
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

// ========== MOCK DATA (NO FAMILY!) ==========

const mockMedicalHistoryExtended = [/* ...keep your medical history data as before... */]

// Only solo plan, no family plan.
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
  // familyMembers: REMOVED
  waitingRoomData: { /* ...same as before... */ },
  pharmacyData: { /* ...same as before... */ },
  medicalHistory: mockMedicalHistoryExtended,
}

// ========== INTERFACES (No familyMembers) ==========

interface UserProfile {
  id: string
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
  email: string | undefined
}
interface DashboardPageContentProps {
  activeTab?: string
  currentUser?: UserProfile | null
  isLoadingUser?: boolean
}
interface StepProps {
  stepNumber: number
  labelKey: TranslationKey
  currentStep: number
}
const SopStep: React.FC<StepProps> = ({ stepNumber, labelKey, currentStep }) => {
  const { language } = useLanguage()
  const t = translations[language]
  const isActive = stepNumber === currentStep
  const isCompleted = stepNumber < currentStep
  return (
    <div className="flex items-center space-x-2 sm:space-x-4">
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
          isActive ? "bg-blue-700 text-white" : isCompleted ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600",
        )}
      >
        {isCompleted ? <Check size={16} /> : stepNumber}
      </div>
      <span className={cn("text-xs sm:text-sm font-medium", isActive ? "text-gray-900" : "text-gray-500")}>
        {t[labelKey]}
      </span>
    </div>
  )
}

interface FileUploadZoneProps {
  onFilesSelected: (files: FileList | null) => void
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
}
const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onFilesSelected, t }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setUploadedFiles(Array.from(event.target.files))
      onFilesSelected(event.target.files)
    }
  }
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => event.preventDefault()
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (event.dataTransfer.files) {
      setUploadedFiles(Array.from(event.dataTransfer.files))
      onFilesSelected(event.dataTransfer.files)
    }
  }
  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center cursor-pointer hover:border-blue-600 hover:bg-gray-50 transition-all"
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input type="file" multiple ref={fileInputRef} className="hidden" onChange={handleFileChange} />
      {uploadedFiles.length === 0 ? (
        <>
          <UploadCloud className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
          <p className="text-base sm:text-lg font-medium text-gray-700 mb-1 sm:mb-2">{t.sopDragAndDrop}</p>
          <p className="text-xs sm:text-sm text-gray-500">{t.sopOrClickToSelect}</p>
          <Button variant="outline" size="sm" className="mt-3 sm:mt-4">
            {t.sopSelectFilesButton}
          </Button>
        </>
      ) : (
        <>
          <CheckCircle className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-green-500 mb-3 sm:mb-4" />
          <p className="text-base sm:text-lg font-medium text-green-700 mb-1 sm:mb-2">
            {t("sopFileUploadSuccess", { count: uploadedFiles.length })}
          </p>
          <p className="text-xs sm:text-sm text-green-600">{t.sopFileUploadSuccessDesc}</p>
          <ul className="mt-2 text-left text-xs text-gray-600 max-h-20 overflow-y-auto">
            {uploadedFiles.map((file, index) => (
              <li key={index} className="truncate flex items-center">
                <Paperclip size={12} className="mr-1 shrink-0" /> {file.name}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

interface ChatMessage {
  id: string
  sender: "user" | "bot"
  text: string
  timestamp: Date
}
interface MedicationReminder {
  id: string
  name: string
  time: string
}

export default function DashboardPageContent({
  activeTab: activeTabFromLayout,
  currentUser,
  isLoadingUser,
}: DashboardPageContentProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tabFromQuery = searchParams.get("tab")
  const activeTab = activeTabFromLayout || tabFromQuery || "dashboard"
  const { language, setLanguage } = useLanguage()
  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) => {
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
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null)
  const [showVideoPrep, setShowVideoPrep] = useState(false)
  const [userQueuePosition, setUserQueuePosition] = useState<number | null>(mockUser.waitingRoomData.userQueuePosition)
  const [estimatedUserWaitTime, setEstimatedUserWaitTime] = useState<string | null>(
    mockUser.waitingRoomData.estimatedUserWaitTime,
  )
  const [liveQueue, setLiveQueue] = useState(mockUser.waitingRoomData.liveQueue)
  const [videoPrepStatusKey, setVideoPrepStatusKey] = useState<TranslationKey>("waitingRoomVideoPrepStatusConnecting")
  const [isCameraEnabled, setIsCameraEnabled] = useState(false)
  const [isMicEnabled, setIsMicEnabled] = useState(false)
  const [sopCurrentStep, setSopCurrentStep] = useState(2)
  const [sopFiles, setSopFiles] = useState<FileList | null>(null)
  const [pharmacyProcessSteps, setPharmacyProcessSteps] = useState(mockUser.pharmacyData.processSteps)
  // TiBot State (NO family pack option)
  const [tibotSubscription, setTibotSubscription] = useState<"solo" | null>(null)
  const [tibotMessages, setTibotMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      sender: "bot",
      text: t("tibotInitialMessage"),
      timestamp: new Date(),
    },
  ])
  const [tibotInput, setTibotInput] = useState("")
  const [isTibotTyping, setIsTibotTyping] = useState(false)
  const [medicationReminders, setMedicationReminders] = useState<MedicationReminder[]>([])
  const [showMedicationModal, setShowMedicationModal] = useState(false)
  const [newMedName, setNewMedName] = useState("")
  const [newMedTime, setNewMedTime] = useState("")
  const chatMessagesRef = useRef<HTMLDivElement>(null)
  // History Tab State
  const [historySearchTerm, setHistorySearchTerm] = useState("")
  const [historyFilterType, setHistoryFilterType] = useState("all")
  const [historyFilterPeriod, setHistoryFilterPeriod] = useState("all")
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareEmail, setShareEmail] = useState("")
  const [shareMessage, setShareMessage] = useState("")
  const filteredHistory = mockUser.medicalHistory
    .filter((item) => {
      if (historyFilterType !== "all" && item.type !== historyFilterType) {
        return false
      }
      return true
    })
    .filter((item) => {
      const searchTermLower = historySearchTerm.toLowerCase()
      return (
        t(item.titleKey).toLowerCase().includes(searchTermLower) ||
        item.doctorName.toLowerCase().includes(searchTermLower) ||
        t(item.reasonKey).toLowerCase().includes(searchTermLower) ||
        (item.diagnoses && item.diagnoses.some((d) => t(d.textKey).toLowerCase().includes(searchTermLower)))
      )
    })

  const healthChartData: ChartData<"line"> = { /* ...keep as before... */ }
  const healthChartOptions: ChartOptions<"line"> = { /* ...keep as before... */ }

  useEffect(() => {
    if (activeTab === "pharmacy") {
      const quoteStep = pharmacyProcessSteps.find((step) => step.id === 2)
      if (quoteStep && quoteStep.status === "active") {
        setTimeout(() => {
          setPharmacyProcessSteps((prevSteps) =>
            prevSteps.map((step) =>
              step.id === 2
                ? { ...step, status: "completed", time: "14:38" }
                : step.id === 3
                ? { ...step, status: "active" }
                : step,
            ),
          )
        }, 5000)
      }
    }
  }, [activeTab, pharmacyProcessSteps])
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
    }
  }, [tibotMessages])
  const handleSopFilesSelected = (files: FileList | null) => setSopFiles(files)
  const handleSelectDoctor = (doctorId: string, waitTime: string, queuePos: number, isPaid = false) => {
    if (isPaid) {
      const confirmPayment = window.confirm(
        language === "fr"
          ? `Confirmer le paiement de ${mockUser.waitingRoomData.doctors.find((d) => d.id === doctorId)?.price} pour la consultation avec ${mockUser.waitingRoomData.doctors.find((d) => d.id === doctorId)?.name} ?`
          : `Confirm payment of ${mockUser.waitingRoomData.doctors.find((d) => d.id === doctorId)?.price} for consultation with ${mockUser.waitingRoomData.doctors.find((d) => d.id === doctorId)?.name}?`,
      )
      if (!confirmPayment) return
    }
    setSelectedDoctor(doctorId)
    setUserQueuePosition(isPaid ? 1 : queuePos + 1)
    setEstimatedUserWaitTime(isPaid ? "~2" : waitTime.replace("~", ""))
    const updatedQueue = [
      ...mockUser.waitingRoomData.liveQueue,
      {
        id: "user",
        nameKey: "Vous" as any,
        statusKey: "waitingRoomWaiting" as TranslationKey,
        position: isPaid ? 1 : queuePos + 1,
        color: "blue",
      },
    ].sort((a, b) => a.position - b.position)
    setLiveQueue(updatedQueue)
    setShowVideoPrep(false)
    setVideoPrepStatusKey("waitingRoomVideoPrepStatusConnecting")
    setTimeout(
      () => {
        setShowVideoPrep(true)
        setTimeout(() => setVideoPrepStatusKey("waitingRoomVideoPrepStatusReady"), 2000)
      },
      isPaid ? 500 : 2000,
    )
  }
  const handleStartConsultation = () => {
    if (!selectedDoctor) return
    const dailyRoomUrl = `/consultation/${selectedDoctor}-${Date.now()}`
    alert(
      language === "fr"
        ? `Ouverture de la consultation vidéo...\n\nURL: ${dailyRoomUrl}`
        : `Opening video consultation...\n\nURL: ${dailyRoomUrl}`,
    )
    window.location.href = dailyRoomUrl
  }
  const handleProceedToPayment = (amount: string, description: string) => {
    router.push(
      `/payment?amount=${encodeURIComponent(amount)}&description=${encodeURIComponent(description)}&lang=${language}`,
    )
  }
  // ONLY allow solo plan now (no family)
  const handleTibotSubscriptionSelect = (plan: "solo") => setTibotSubscription(plan)
  const handleAccessTibot = () => {
    if (tibotSubscription) {
      // In a real app, you'd verify this against user data
      console.log(`Accessing TiBot with ${tibotSubscription} pack.`)
    } else {
      alert(language === "fr" ? "Veuillez sélectionner un pack." : "Please select a pack.")
    }
  }
  // ...rest of the handlers remain unchanged

  // --- CONTENT RENDER ---

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        // ...keep all dashboard code, but no "family" stats, no family members
        // (no change needed if you already don't reference family in the dashboard)
        // ...all code for dashboard
        break
      // ----- REMOVE THE "family" CASE -----
      // case "family": (DELETE THIS ENTIRE CASE AND ITS CONTENT)
      // -----
      // All other cases unchanged ...
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
