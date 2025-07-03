"use client"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Check,
  Truck,
  FileText,
  CreditCard as LucideCreditCard,
  Smartphone as LucideSmartphone,
  Search,
  Shuffle,
  UserCheck,
  Stethoscope,
  Activity,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { translations } from "@/lib/translations"

interface PricingCardProps {
  id: string
  title: string
  description?: string
  priceMUR?: string
  priceEUR?: string
  residents?: string
  tourists?: string
  price?: string
  perMonth?: string
  priceNote?: string
  features: { icon: React.ReactNode; text: string }[]
  buttonText: string
  isFeatured?: boolean
  buttonVariant?: "default" | "secondary" | "outline" | "ghost" | "link"
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  description,
  priceMUR,
  priceEUR,
  residents,
  tourists,
  price,
  perMonth,
  features,
  buttonText,
  isFeatured,
  buttonVariant = "default",
}) => {
  return (
    <div
      className={`bg-white p-8 rounded-lg shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out hover:translate-y-[-5px] flex flex-col ${
        isFeatured ? "border-2 border-blue-600 relative" : ""
      }`}
    >
      {isFeatured && (
        <div className="absolute top-[-12px] right-5 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
          POPULAIRE
        </div>
      )}
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}
      <div className="mb-6">
        {priceMUR && (
          <>
            <div className="text-2xl font-bold text-blue-600 mb-1">{priceMUR}</div>
            {residents && <div className="text-sm text-gray-500">{residents}</div>}
          </>
        )}
        {priceEUR && tourists && (
          <>
            <div className={`text-2xl font-bold text-blue-600 ${priceMUR ? "mt-3" : ""} mb-1`}>{priceEUR}</div>
            <div className="text-sm text-gray-500">{tourists}</div>
          </>
        )}
        {price && (
          <>
            <div className="text-3xl font-bold text-blue-600">{price}</div>
            {perMonth && <div className="text-gray-600">{perMonth}</div>}
          </>
        )}
      </div>
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            {feature.icon}
            <span className="ml-3 text-gray-700">{feature.text}</span>
          </li>
        ))}
      </ul>
      <Link href={`/start-consultation?plan=${id}`} className="w-full mt-auto">
        <Button
          className={`w-full py-3 rounded-lg font-semibold transition-colors ${
            buttonVariant === "default" || isFeatured
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : buttonVariant === "secondary"
                ? "bg-gray-600 text-white hover:bg-gray-700"
                : "bg-teal-500 text-white hover:bg-teal-600"
          }`}
          variant={isFeatured ? "default" : buttonVariant}
        >
          {buttonText}
        </Button>
      </Link>
    </div>
  )
}

const PaymentMethod: React.FC<{ icon: React.ReactNode; name: string }> = ({ icon, name }) => (
  <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow">
    {icon}
    <span className="font-medium">{name}</span>
  </div>
)

export default function PricingSection() {
  const { language } = useLanguage()
  const t = translations[language]

  const plans: PricingCardProps[] = [
    {
      id: "pay-per-use",
      title: t.pricingPlan1Title,
      priceMUR: t.pricingPlan1PriceMUR,
      residents: t.pricingPlan1Residents,
      priceEUR: t.pricingPlan1PriceEUR,
      tourists: t.pricingPlan1Tourists,
      features: [
        { icon: <Check className="text-green-500" />, text: t.pricingPlan1Feature1 },
        { icon: <Truck className="text-orange-500" />, text: t.pricingPlan1Feature2 },
      ],
      buttonText: t.pricingPlan1Button,
      buttonVariant: "secondary",
    },
    {
      id: "solo",
      title: t.pricingPlan2Title,
      price: t.pricingPlan2Price,
      perMonth: t.pricingPlan2PerMonth,
      features: [
        { icon: <Check className="text-green-500" />, text: t.pricingPlan2Feature1 },
        { icon: <Truck className="text-green-500" />, text: t.pricingPlan2Feature2 },
        { icon: <FileText className="text-green-500" />, text: t.pricingPlan2Feature3 },
      ],
      buttonText: t.pricingPlan2Button,
      isFeatured: true,
    },
    {
      id: "second-opinion",
      title: t.pricingPlan4Title,
      description: t.pricingPlan4Description,
      priceMUR: t.pricingPlan4PriceMUR,
      priceNote: t.pricingPlan4PriceNote,
      residents: t.pricingPlan4PriceNote,
      features: [
        { icon: <Search className="text-teal-500" />, text: t.pricingPlan4Feature1 },
        { icon: <Shuffle className="text-teal-500" />, text: t.pricingPlan4Feature2 },
        { icon: <UserCheck className="text-teal-500" />, text: t.pricingPlan4Feature3 },
        { icon: <Stethoscope className="text-teal-500" />, text: t.pricingPlan4Feature4 },
        { icon: <FileText className="text-teal-500" />, text: t.pricingPlan4Feature5 },
        { icon: <Activity className="text-teal-500" />, text: t.pricingPlan4Feature6 },
      ],
      buttonText: t.pricingPlan4Button,
      buttonVariant: "outline",
    },
  ]

  const paymentMethods = [
    { icon: <LucideCreditCard className="text-2xl text-blue-600" />, name: "Visa" },
    { icon: <LucideCreditCard className="text-2xl text-red-500" />, name: "Mastercard" },
    { icon: <LucideCreditCard className="text-2xl text-blue-500" />, name: "PayPal" },
    { icon: <LucideCreditCard className="text-2xl text-blue-400" />, name: "Amex" },
    { icon: <LucideSmartphone className="text-2xl text-green-600" />, name: "Juice by MCB" },
  ]

  return (
    <section id="tarifs" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{t.pricingTitle}</h2>
        </div>
        
        <div className="grid gap-8 max-w-6xl mx-auto lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
          {plans.map((plan) => (
            <PricingCard key={plan.id} {...plan} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">{t.paymentMethodsTitle}</h3>
          <div className="flex flex-wrap justify-center items-center gap-6">
            {paymentMethods.map((method, index) => (
              <PaymentMethod key={index} icon={method.icon} name={method.name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
