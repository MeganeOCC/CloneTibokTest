"use client"

import React, { useState } from "react"
import { useLanguage, type Language } from "@/contexts/language-context"
import { translations, type TranslationKey } from "@/lib/translations"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Eye, EyeOff, Heart, UploadCloud, ArrowRight, ArrowLeft, CheckCircle2, Info, Check } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const getTranslation = (lang: Language, key: TranslationKey) => {
  return translations[lang][key] || translations["en"][key] || key
}

// Doctor Page Header Component
const DoctorPageHeader = () => {
  const { language, setLanguage } = useLanguage()
  const t = (key: TranslationKey) => getTranslation(language, key)

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3 cursor-pointer">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Heart className="text-white h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">TIBOK</h1>
              <p className="text-sm text-gray-600">{t("doctorAccessPageBaseline")}</p>
            </div>
          </Link>
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
        </div>
      </div>
    </header>
  )
}

// Login Form Component (unchanged)
const LoginForm = () => {
  const { language } = useLanguage()
  const t = (key: TranslationKey) => getTranslation(language, key)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate login (TODO: wire real login)
    setTimeout(() => {
      alert(t("doctorLoginButton") + " successful! Redirecting to dashboard...")
      router.push("/doctor/dashboard")
    }, 1000)
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{t("doctorLoginTitle")}</CardTitle>
        <CardDescription>{t("doctorAccessSubtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email-login" className="block text-sm font-medium text-gray-700 mb-1">
              {t("doctorLoginProfessionalEmail")}
            </label>
            <Input type="email" id="email-login" placeholder="dr.nom@exemple.com" required />
          </div>
          <div>
            <label htmlFor="password-login" className="block text-sm font-medium text-gray-700 mb-1">
              {t("doctorLoginPassword")}
            </label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} id="password-login" required />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox id="remember-me" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                {t("doctorLoginRememberMe")}
              </label>
            </div>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
              {t("doctorLoginForgotPassword")}
            </a>
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            {t("doctorLoginButton")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// --- Registration Steps ---

const RegistrationStep1 = ({ formData, updateField, onNext }: any) => {
  const { language } = useLanguage()
  const t = (key: TranslationKey) => getTranslation(language, key)

  // Controlled checkboxes for languages
  const handleLanguageChange = (lang: string, checked: boolean) => {
    let updated = [...formData.languages]
    if (checked) {
      updated = [...updated, lang]
    } else {
      updated = updated.filter((l: string) => l !== lang)
    }
    updateField("languages", updated)
  }

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{t("doctorRegisterPersonalInfoTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault()
            onNext()
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                {t("doctorRegisterFirstName")}
              </label>
              <Input id="firstName" required value={formData.firstName} onChange={e => updateField("firstName", e.target.value)} />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                {t("doctorRegisterLastName")}
              </label>
              <Input id="lastName" required value={formData.lastName} onChange={e => updateField("lastName", e.target.value)} />
            </div>
          </div>
          <div>
            <label htmlFor="profEmail" className="block text-sm font-medium text-gray-700 mb-1">
              {t("doctorRegisterProfessionalEmail")}
            </label>
            <Input type="email" id="profEmail" required value={formData.profEmail} onChange={e => updateField("profEmail", e.target.value)} />
          </div>
          <div>
            <label htmlFor="phoneReg" className="block text-sm font-medium text-gray-700 mb-1">
              {t("doctorRegisterPhone")}
            </label>
            <Input type="tel" id="phoneReg" required value={formData.phoneReg} onChange={e => updateField("phoneReg", e.target.value)} />
          </div>
          <div>
            <label htmlFor="mcmNumber" className="block text-sm font-medium text-gray-700 mb-1">
              {t("doctorRegisterMedicalCouncilNumber")}
            </label>
            <Input id="mcmNumber" required value={formData.mcmNumber} onChange={e => updateField("mcmNumber", e.target.value)} />
          </div>
          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
              {t("doctorRegisterMainSpecialty")}
            </label>
            <Select value={formData.specialty} onValueChange={v => updateField("specialty", v)} required>
              <SelectTrigger id="specialty">
                <SelectValue placeholder={t("doctorRegisterSelectSpecialty")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">{t("doctorRegisterSpecialtyGeneral")}</SelectItem>
                <SelectItem value="cardiology">{t("doctorRegisterSpecialtyCardiology")}</SelectItem>
                <SelectItem value="dermatology">{t("doctorRegisterSpecialtyDermatology")}</SelectItem>
                <SelectItem value="pediatrics">{t("doctorRegisterSpecialtyPediatrics")}</SelectItem>
                <SelectItem value="psychiatry">{t("doctorRegisterSpecialtyPsychiatry")}</SelectItem>
                <SelectItem value="other">{t("doctorRegisterSpecialtyOther")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
              {t("doctorRegisterYearsExperience")}
            </label>
            <Select value={formData.experience} onValueChange={v => updateField("experience", v)} required>
              <SelectTrigger id="experience">
                <SelectValue placeholder={t("doctorRegisterSelectExperience")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-2">{t("doctorRegisterExperience02")}</SelectItem>
                <SelectItem value="3-5">{t("doctorRegisterExperience35")}</SelectItem>
                <SelectItem value="6-10">{t("doctorRegisterExperience610")}</SelectItem>
                <SelectItem value="10+">{t("doctorRegisterExperience10plus")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("doctorRegisterLanguagesSpoken")}</label>
            <div className="space-y-2">
              {[
                { id: "langFr", labelKey: "doctorRegisterLanguageFrench", value: "Français" },
                { id: "langEn", labelKey: "doctorRegisterLanguageEnglish", value: "Anglais" },
                { id: "langCr", labelKey: "doctorRegisterLanguageCreole", value: "Créole" },
                { id: "langHi", labelKey: "doctorRegisterLanguageHindi", value: "Hindi" },
              ].map((lang) => (
                <div key={lang.id} className="flex items-center">
                  <Checkbox
                    id={lang.id}
                    checked={formData.languages.includes(lang.value)}
                    onCheckedChange={checked => handleLanguageChange(lang.value, !!checked)}
                  />
                  <label htmlFor={lang.id} className="ml-2 text-sm text-gray-700">
                    {t(lang.labelKey as TranslationKey)}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {t("doctorRegisterNextButton")} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Placeholder for now for file uploads (just move to next)
const RegistrationStep2 = ({ onNext, onPrev }: any) => {
  const { language } = useLanguage()
  const t = (key: TranslationKey) => getTranslation(language, key)
  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{t("doctorRegisterRequiredDocsTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-6"
          onSubmit={e => { e.preventDefault(); onNext() }}
        >
          {/* Implement file uploads later */}
          <div className="flex flex-col gap-4">
            <div className="bg-slate-100 p-4 rounded text-center">Téléversement des documents sera ajouté après validation du workflow.</div>
          </div>
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onPrev}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Précédent
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Suivant <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

const RegistrationStep3 = ({ formData, updateField, onPrev, onSubmit, loading, error }: any) => {
  const { language } = useLanguage()
  const t = (key: TranslationKey) => getTranslation(language, key)
  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{t("doctorRegisterValidationFinalizationTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-6"
          onSubmit={e => { e.preventDefault(); onSubmit(); }}
        >
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-medium text-gray-900 mb-2">{t("doctorRegisterTermsOfUseTitle")}</h4>
            {/* ...add any terms here... */}
          </div>
          <div>
            <label htmlFor="createPassword" className="block text-sm font-medium text-gray-700 mb-1">
              {t("doctorRegisterCreatePassword")}
            </label>
            <Input
              type="password"
              id="createPassword"
              minLength={8}
              required
              value={formData.password}
              onChange={e => updateField("password", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              {t("doctorRegisterConfirmPassword")}
            </label>
            <Input
              type="password"
              id="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={e => updateField("confirmPassword", e.target.value)}
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <div className="text-red-500 text-xs">Les mots de passe ne correspondent pas</div>
            )}
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onPrev}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Précédent
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Création en cours..." : <>
                {t("doctorRegisterCreateAccountButton")} <Check className="ml-2 h-4 w-4" />
              </>}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// -- Main RegistrationForm
const RegistrationForm = ({ onRegistrationSubmit }: { onRegistrationSubmit: () => void }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    profEmail: "",
    phoneReg: "",
    mcmNumber: "",
    specialty: "",
    experience: "",
    languages: [],
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form data state management
  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // --- Handle doctor registration ---
  const handleRegisterDoctor = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }
    setLoading(true)
    setError(null)
    try {
      // 1. Create user in Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.profEmail,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`,
            role: "doctor"
          }
        }
      })
      if (signUpError) throw signUpError

      const user = signUpData.user
      if (!user) throw new Error("User signup failed")

      // 2. Insert in doctors table
      const { error: insertError } = await supabase.from("doctors").insert([
        {
          user_id: user.id,
          full_name: `${formData.firstName} ${formData.lastName}`,
          specialty: formData.specialty,
          email: formData.profEmail,
          phone_number: formData.phoneReg,
          medical_council_number: formData.mcmNumber,
          years_experience: formData.experience,
          languages: (formData.languages as string[]).join(","),
        }
      ])
      if (insertError) throw insertError

      onRegistrationSubmit()
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step, index) => (
            <div key={step} className={`flex items-center ${index < 2 ? "flex-1" : ""}`}>
              <div className={`flex items-center ${currentStep >= step ? "text-blue-600" : "text-gray-500"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${currentStep >= step ? "bg-blue-600 text-white border-blue-600" : "bg-gray-200 border-gray-300"}`}>
                  {currentStep > step ? <Check className="h-4 w-4" /> : step}
                </div>
                <span className={`ml-2 text-sm font-medium ${currentStep >= step ? "text-blue-600" : "text-gray-500"}`}>
                  {["Informations", "Documents", "Validation"][index]}
                </span>
              </div>
              {index < 2 && <div className={`flex-1 h-0.5 mx-4 ${currentStep > step ? "bg-blue-600" : "bg-gray-300"}`} />}
            </div>
          ))}
        </div>
      </div>
      {currentStep === 1 && (
        <RegistrationStep1 formData={formData} updateField={updateField} onNext={() => setCurrentStep(2)} />
      )}
      {currentStep === 2 && (
        <RegistrationStep2 onNext={() => setCurrentStep(3)} onPrev={() => setCurrentStep(1)} />
      )}
      {currentStep === 3 && (
        <RegistrationStep3
          formData={formData}
          updateField={updateField}
          onPrev={() => setCurrentStep(2)}
          onSubmit={handleRegisterDoctor}
          loading={loading}
          error={error}
        />
      )}
    </div>
  )
}

// --- Success Modal ---
const SuccessModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { language } = useLanguage()
  const t = (key: TranslationKey) => getTranslation(language, key)
  if (!isOpen) return null
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center items-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-lg font-medium">{t("doctorRegisterSuccessModalTitle")}</DialogTitle>
          <DialogDescription className="mt-2 px-2 text-sm text-gray-500">
            {t("doctorRegisterSuccessModalMessage")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700">
            {t("doctorRegisterSuccessModalUnderstood")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// --- Main Page Export ---
export default function DoctorAccessPage() {
  const [activeTab, setActiveTab] = useState("login")
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const { language } = useLanguage()
  const t = (key: TranslationKey) => getTranslation(language, key)

  const handleRegistrationSuccess = () => setIsSuccessModalOpen(true)
  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false)
    setActiveTab("login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-100">
      <DoctorPageHeader />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto">
            <TabsTrigger value="login">{t("doctorLoginTab")}</TabsTrigger>
            <TabsTrigger value="register">{t("doctorRegisterTab")}</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-8">
            <LoginForm />
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t("doctorLoginNewDoctor")}{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-blue-600 hover:text-blue-500 font-medium"
                  onClick={() => setActiveTab("register")}
                >
                  {t("doctorLoginCreateAccount")}
                </Button>
              </p>
            </div>
          </TabsContent>
          <TabsContent value="register" className="mt-8">
            <RegistrationForm onRegistrationSubmit={handleRegistrationSuccess} />
          </TabsContent>
        </Tabs>
      </div>
      <SuccessModal isOpen={isSuccessModalOpen} onClose={closeSuccessModal} />
    </div>
  )
}
