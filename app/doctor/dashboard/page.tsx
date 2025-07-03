"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useLanguage } from "@/contexts/language-context"
import { 
  Calendar, 
  Clock, 
  Star, 
  Activity, 
  Users, 
  FileText, 
  ChevronRight,
  Bell,
  Menu,
  Heart,
  Video,
  MessageSquare,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function DoctorDashboard() {
  const { language, setLanguage } = useLanguage()
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // Doctor profile state
  const [doctorName, setDoctorName] = useState<string>("")
  const [doctorEmail, setDoctorEmail] = useState<string>("")
  const [doctorRole, setDoctorRole] = useState<string>("")

  useEffect(() => {
    checkAuth()
    fetchDoctorProfile()
  }, [])

  useEffect(() => {
    // Update role text when language changes
    if (doctorName) {
      setDoctorRole(language === 'fr' ? 'Médecin Généraliste' : 'General Practitioner')
    }
  }, [language, doctorName])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/doctor')
    }
    setLoading(false)
  }

  const fetchDoctorProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        setDoctorEmail(user.email || '')
        
        // First try to get from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()

        if (profile?.full_name) {
          setDoctorName(profile.full_name)
        } else {
          // Fallback to doctors table
          const { data: doctor } = await supabase
            .from('doctors')
            .select('full_name, specialty')
            .eq('user_id', user.id)
            .single()

          if (doctor) {
            setDoctorName(doctor.full_name || user.email?.split('@')[0] || 'Doctor')
            if (doctor.specialty) {
              setDoctorRole(doctor.specialty)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching doctor profile:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/doctor')
  }

  const stats = [
    { 
      label: language === 'fr' ? "Consultations Aujourd'hui" : "Today's Consultations", 
      value: "12", 
      icon: Calendar, 
      color: "text-blue-600" 
    },
    { 
      label: language === 'fr' ? "Patients en Attente" : "Waiting Patients", 
      value: "3", 
      icon: Clock, 
      color: "text-green-600" 
    },
    { 
      label: language === 'fr' ? "Note Satisfaction" : "Satisfaction Rating", 
      value: "4.8", 
      icon: Star, 
      color: "text-purple-600" 
    },
    { 
      label: language === 'fr' ? "Temps Moyen" : "Average Time", 
      value: "18min", 
      icon: Activity, 
      color: "text-orange-600" 
    }
  ]

  const quickActions = [
    { 
      title: language === 'fr' ? "Démarrer Consultation" : "Start Consultation", 
      icon: Video, 
      href: "/doctor/start-consultation", 
      color: "bg-blue-600 hover:bg-blue-700" 
    },
    { 
      title: language === 'fr' ? "Nouvelle Ordonnance" : "New Prescription", 
      icon: FileText, 
      href: "/doctor/prescriptions", 
      color: "bg-green-600 hover:bg-green-700" 
    },
    { 
      title: language === 'fr' ? "Messages Patients" : "Patient Messages", 
      icon: MessageSquare, 
      href: "/doctor/messages", 
      color: "bg-purple-600 hover:bg-purple-700" 
    }
  ]

  const recentPatients = [
    { name: "Jean Dupont", time: "14:30", reason: language === 'fr' ? "Consultation générale" : "General consultation" },
    { name: "Marie Martin", time: "15:00", reason: language === 'fr' ? "Suivi traitement" : "Treatment follow-up" },
    { name: "Pierre Durand", time: "15:30", reason: language === 'fr' ? "Renouvellement ordonnance" : "Prescription renewal" }
  ]

  const navigation = [
    { name: language === 'fr' ? 'Tableau de bord' : 'Dashboard', href: '/doctor/dashboard', icon: Activity },
    { name: language === 'fr' ? 'Consultation Vidéo' : 'Video Consultation', href: '/doctor/consultation', icon: Video },
    { name: language === 'fr' ? 'Ordonnances IA' : 'AI Prescriptions', href: '/doctor/prescriptions', icon: FileText },
    { name: language === 'fr' ? 'Dossiers Patients' : 'Patient Records', href: '/doctor/patients', icon: Users },
    { name: language === 'fr' ? 'Chat Patients' : 'Patient Chat', href: '/doctor/chat', icon: MessageSquare, badge: '3' },
    { name: language === 'fr' ? 'Mon Profil' : 'My Profile', href: '/doctor/profile', icon: Users },
    { name: language === 'fr' ? 'Comptes-rendus IA' : 'AI Reports', href: '/doctor/reports', icon: FileText },
    { name: language === 'fr' ? 'Performance' : 'Performance', href: '/doctor/performance', icon: Activity }
  ]

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-lg">{language === 'fr' ? 'Chargement...' : 'Loading...'}</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <Link href="/doctor/dashboard" className="flex items-center space-x-3 ml-4 lg:ml-0">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Heart className="text-white h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">TIBOK</h1>
                  <p className="text-sm text-gray-600">
                    {language === 'fr' ? 'Interface Médecin' : 'Doctor Interface'}
                  </p>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <Button
                  variant={language === 'fr' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('fr')}
                  className={language === 'fr' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  FR
                </Button>
                <Button
                  variant={language === 'en' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLanguage('en')}
                  className={language === 'en' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  EN
                </Button>
              </div>

              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold">
                    {doctorName ? doctorName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'DR'}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {doctorName || (language === 'fr' ? 'Chargement...' : 'Loading...')}
                  </p>
                  <p className="text-xs text-gray-500">{doctorRole}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 mt-16`}>
          <div className="h-full px-3 py-4 overflow-y-auto">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Icon className="mr-3 h-5 w-5 text-gray-400" />
                    {item.name}
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>
            
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5" />
                {language === 'fr' ? 'Déconnexion' : 'Logout'}
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {language === 'fr' ? 'Tableau de Bord Médecin' : 'Doctor Dashboard'}
            </h1>
            <p className="text-gray-600">
              {language === 'fr' ? 'Bienvenue dans votre espace de travail TIBOK' : 'Welcome to your TIBOK workspace'}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <Icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{language === 'fr' ? 'Actions Rapides' : 'Quick Actions'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Link key={index} href={action.href}>
                      <Button className={`w-full justify-start ${action.color} text-white`}>
                        <Icon className="mr-3 h-5 w-5" />
                        {action.title}
                      </Button>
                    </Link>
                  )
                })}
              </CardContent>
            </Card>

            {/* Recent Patients */}
            <Card>
              <CardHeader>
                <CardTitle>{language === 'fr' ? 'Patients Récents' : 'Recent Patients'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPatients.map((patient, index) => (
                    <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-semibold">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-gray-500">{patient.time} - {patient.reason}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
