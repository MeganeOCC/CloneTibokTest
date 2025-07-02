"use client"

import type React from "react"
import { useState } from "react"
import { useLanguage, type Language } from "@/contexts/language-context"
import { translations, type TranslationKey } from "@/lib/translations"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Eye, EyeOff, Heart } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Helper to get translations
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

// Login Form Component
const LoginForm = () => {
  const { language } = useLanguage()
  const t = (key: TranslationKey) => getTranslation(language, key)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      console.log('Attempting login with email:', email)
      
      const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (loginError) {
        console.error('Login error:', loginError)
        throw loginError
      }

      console.log('Login successful, user:', authData.user)

      // First check if user exists and has the correct email
      const userId = authData.user.id
      console.log('Checking profile for user ID:', userId)

      // Try direct query to profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      console.log('Profile query result:', { profile, profileError })

      if (profileError) {
        console.error('Profile error details:', {
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint,
          code: profileError.code
        })
        
        // If profile doesn't exist, try to create it
        if (profileError.code === 'PGRST116') {
          console.log('Profile not found, attempting to create one...')
          
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: authData.user.email,
              role: 'doctor',
              full_name: 'Dr. Customer Service',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single()

          if (createError) {
            console.error('Failed to create profile:', createError)
            throw new Error("Impossible de créer le profil utilisateur")
          }

          console.log('Profile created successfully:', newProfile)
          router.push("/doctor/dashboard")
          return
        }
        
        throw new Error("Erreur lors de la récupération du profil")
      }

      if (!profile) {
        console.error('No profile found for user:', userId)
        throw new Error("Profil utilisateur introuvable")
      }

      console.log('Profile found:', profile)
      console.log('User role:', profile.role)

      if (profile.role !== 'doctor') {
        console.error('Access denied - user role is:', profile.role)
        await supabase.auth.signOut()
        throw new Error("Accès réservé aux médecins")
      }

      console.log('Doctor login successful, redirecting to dashboard')
      router.push("/doctor/dashboard")
      
    } catch (err: any) {
      console.error('Login process error:', err)
      setError(err.message || "Erreur de connexion")
    } finally {
      setLoading(false)
    }
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
            <Input 
              type="email" 
              id="email-login" 
              placeholder="dr.nom@exemple.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="password-login" className="block text-sm font-medium text-gray-700 mb-1">
              {t("doctorLoginPassword")}
            </label>
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"} 
                id="password-login" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10"
              />
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
              <Checkbox 
                id="remember-me" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                {t("doctorLoginRememberMe")}
              </label>
            </div>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
              {t("doctorLoginForgotPassword")}
            </a>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700" 
            disabled={loading}
          >
            {loading ? "Connexion..." : t("doctorLoginButton")}
          </Button>
        </form>

        {/* Debug info for testing */}
        <div className="mt-4 p-3 bg-gray-50 rounded-md text-xs text-gray-600">
          <p className="font-semibold mb-1">Test credentials:</p>
          <p>Email: customer.service@obesity-care-clinic.com</p>
          <p>Password: [the password you set]</p>
          <p className="mt-2 text-gray-500">Check browser console (F12) for debug info</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DoctorAccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-100">
      <DoctorPageHeader />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <LoginForm />
      </div>
    </div>
  )
}
