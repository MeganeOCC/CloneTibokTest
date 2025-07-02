"use client"

import React, { useState } from "react"
import { useLanguage, type Language } from "@/contexts/language-context"
import { translations, type TranslationKey } from "@/lib/translations"
import { getSupabaseBrowserClient } from "@/lib/supabase/client" // Correct import!
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

// Helper for translations
const getTranslation = (lang: Language, key: TranslationKey) => {
  return translations[lang][key] || translations["en"][key] || key
}

// Doctor Page Header and Login form... (unchanged, keep your code)

const DoctorPageHeader = () => { /* ...keep as is... */ }
const LoginForm = () => { /* ...keep as is... */ }

// -------- Registration Steps ---------

// (Below, new: controlled inputs for form fields!)
const RegistrationStep1 = ({ formData, updateField, onNext }) => {
  const { language } = useLanguage()
  const t = (key: TranslationKey) => getTranslation(language, key)
  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{t("doctorRegisterPersonalInfoTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-6"
          onSubmit={e => { e.preventDefault(); onNext(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">{t("doctorRegisterFirstName")}</label>
              <Input id="firstName" required value={formData.firstName} onChange={e => updateField("firstName", e.target.value)} />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">{t("doctorRegisterLastName")}</label>
              <Input id="lastName" required value={formData.lastName} onChange={e => updateField("lastName", e.target.value)} />
            </div>
          </div>
          <div>
            <label htmlFor="profEmail" className="block text-sm font-medium text-gray-700 mb-1">{t("doctorRegisterProfessionalEmail")}</label>
            <Input type="email" id="profEmail" required value={formData.profEmail} onChange={e => updateField("profEmail", e.target.value)} />
          </div>
          <div>
            <label htmlFor="phoneReg" className="block text-sm font-medium text-gray-700 mb-1">{t("doctorRegisterPhone")}</label>
            <Input type="tel" id="phoneReg" placeholder="+230 XXXX XXXX" required value={formData.phoneReg} onChange={e => updateField("phoneReg", e.target.value)} />
          </div>
          <div>
            <label htmlFor="mcmNumber" className="block text-sm font-medium text-gray-700 mb-1">{t("doctorRegisterMedicalCouncilNumber")}</label>
            <Input id="mcmNumber" required value={formData.mcmNumber} onChange={e => updateField("mcmNumber", e.target.value)} />
          </div>
          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">{t("doctorRegisterMainSpecialty")}</label>
            <Select required value={formData.specialty} onValueChange={v => updateField("specialty", v)}>
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
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">{t("doctorRegisterYearsExperience")}</label>
            <Select required value={formData.experience} onValueChange={v => updateField("experience", v)}>
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
                { id: "langFr", label: t("doctorRegisterLanguageFrench"), value: "fr" },
                { id: "langEn", label: t("doctorRegisterLanguageEnglish"), value: "en" },
                { id: "langCr", label: t("doctorRegisterLanguageCreole"), value: "creole" },
                { id: "langHi", label: t("doctorRegisterLanguageHindi"), value: "hindi" }
              ].map(lang => (
                <div key={lang.id} className="flex items-center">
                  <Checkbox id={lang.id}
                    checked={formData.languages.includes(lang.value)}
                    onCheckedChange={checked => {
                      updateField(
                        "languages",
                        checked
                          ? [...formData.languages, lang.value]
                          : formData.languages.filter(l => l !== lang.value)
                      )
                    }}
                  />
                  <label htmlFor={lang.id} className="ml-2 text-sm text-gray-700">{lang.label}</label>
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

const RegistrationStep2 = ({ onNext, onPrev }) => {
  // ...implement your file upload logic as you wish
  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Documents (non-fonctionnel demo)</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={e => { e.preventDefault(); onNext(); }}>
          {/* File upload components here */}
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onPrev}><ArrowLeft className="mr-2 h-4 w-4" />Précédent</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Suivant <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

const RegistrationStep3 = ({ formData, updateField, onPrev, onSubmit, loading, error }) => {
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
          onSubmit={e => { e.preventDefault(); onSubmit(); }}>
          {/* Terms + password */}
          <div>
            <label htmlFor="createPassword" className="block text-sm font-medium text-gray-700 mb-1">{t("doctorRegisterCreatePassword")}</label>
            <Input type="password" id="createPassword" minLength={8} required value={formData.password} onChange={e => updateField("password", e.target.value)} />
            <p className="text-xs text-gray-500 mt-1">{t("doctorRegisterPasswordHelp")}</p>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">{t("doctorRegisterConfirmPassword")}</label>
            <Input type="password" id="confirmPassword" required value={formData.confirmPassword} onChange={e => updateField("confirmPassword", e.target.value)} />
          </div>
          {error && <div className="text-red-500">{error}</div>}
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onPrev}><ArrowLeft className="mr-2 h-4 w-4" /> {t("doctorRegisterPreviousButton")}</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Enregistrement..." : <>Créer mon compte <Check className="ml-2 h-4 w-4" /></>}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

const RegistrationForm = ({ onRegistrationSubmit }) => {
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

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Main submit function for registration (step 3)
  const handleRegisterDoctor = async () => {
    setError(null)
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }
    setLoading(true)
    const supabase = getSupabaseBrowserClient()
    try {
      // 1. Sign up the user
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
      const user = signUpData?.user
      if (!user) throw new Error("Inscription utilisateur échouée")

      // 2. Insert into doctors table (wait for profile insert trigger!)
      const { error: insertError } = await supabase.from("doctors").insert([
        {
          user_id: user.id,
          full_name: `${formData.firstName} ${formData.lastName}`,
          specialty: formData.specialty,
          email: formData.profEmail,
          phone_number: formData.phoneReg,
          // ...add your other fields...
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
      {/* Stepper UI... (keep your previous code if you want) */}
      {currentStep === 1 && <RegistrationStep1 formData={formData} updateField={updateField} onNext={() => setCurrentStep(2)} />}
      {currentStep === 2 && <RegistrationStep2 onNext={() => setCurrentStep(3)} onPrev={() => setCurrentStep(1)} />}
      {currentStep === 3 && <RegistrationStep3 formData={formData} updateField={updateField} onPrev={() => setCurrentStep(2)} onSubmit={handleRegisterDoctor} loading={loading} error={error} />}
    </div>
  )
}

const SuccessModal = ({ isOpen, onClose }) => {
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
          <DialogDescription className="mt-2 px-2 text-sm text-gray-500">{t("doctorRegisterSuccessModalMessage")}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700">{t("doctorRegisterSuccessModalUnderstood")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

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
                <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-500 font-medium" onClick={() => setActiveTab("register")}>{t("doctorLoginCreateAccount")}</Button>
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
