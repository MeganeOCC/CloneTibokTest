"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

// ----- Mock Data (no family pack, no family members) -----
const mockUser = {
  name: "Marie Dubois",
  plan: "pricingSoloPackTitle",
  stats: { consultations: "3/4", prescriptions: 2, secondOpinions: 1, deliveries: 5 },
  waitingRoomData: {
    userQueuePosition: null,
    estimatedUserWaitTime: null,
    liveQueue: [],
    doctors: []
  },
  pharmacyData: {
    processSteps: [
      { id: 1, title: "Préparation", status: "completed", time: "14:32" },
      { id: 2, title: "En cours", status: "active" },
      { id: 3, title: "Livraison", status: "waiting" }
    ],
    prescription: { date: "15 Décembre 2024", doctor: "Dr. Patel", statusKey: "processing", items: [] },
    selectedPharmacy: { name: "Pharmacie Central Plus", address: "Rue du Marché" },
    estimate: { medicationsAmount: "850 MUR", prepFees: "50 MUR", delivery: "Gratuit", totalAmount: "900 MUR" },
    notifications: []
  },
  medicalHistory: []
}

export default function DashboardPageContent({ activeTab: activeTabFromLayout }: { activeTab?: string }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tabFromQuery = searchParams.get("tab")
  const activeTab = activeTabFromLayout || tabFromQuery || "dashboard"
  const [pharmacyProcessSteps, setPharmacyProcessSteps] = useState(mockUser.pharmacyData.processSteps)

  // Handle pharmacy logic
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

  function renderContent() {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold">Bienvenue {mockUser.name}</h1>
            <p>Plan: Solo</p>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
              <Card><CardContent className="p-4">Consultations: {mockUser.stats.consultations}</CardContent></Card>
              <Card><CardContent className="p-4">Prescriptions: {mockUser.stats.prescriptions}</CardContent></Card>
              <Card><CardContent className="p-4">Second avis: {mockUser.stats.secondOpinions}</CardContent></Card>
              <Card><CardContent className="p-4">Livraisons: {mockUser.stats.deliveries}</CardContent></Card>
            </div>
          </div>
        )
      case "pharmacy":
        return (
          <div className="p-8">
            <h2 className="text-xl font-bold mb-4">Pharmacie</h2>
            {pharmacyProcessSteps.map((step) => (
              <div key={step.id} className="mb-2">
                <span className="font-semibold">{step.title}</span>
                {step.status === "completed" && <span className="ml-2 text-green-600">✔ Terminé à {step.time}</span>}
                {step.status === "active" && <span className="ml-2 text-blue-600">⏳ En cours</span>}
                {step.status === "waiting" && <span className="ml-2 text-gray-400">En attente</span>}
              </div>
            ))}
          </div>
        )
      case "waiting-room":
        return <div className="p-8">Salle d'attente (no family logic)</div>
      case "second-opinion":
        return <div className="p-8">Second avis (no family logic)</div>
      case "tibot":
        return <div className="p-8">TiBot IA (no family logic)</div>
      case "history":
        return <div className="p-8">Historique (no family logic)</div>
      default:
        return <div className="p-8">Contenu introuvable</div>
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
