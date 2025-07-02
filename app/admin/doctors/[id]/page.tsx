"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"

interface DoctorDetails {
  id: string
  user_id: string
  full_name: string
  email: string
  phone_number: string
  specialty: string
  medical_council_number: string
  years_experience: string
  languages: string
  created_at: string
  profile_completed: boolean
}

interface Consultation {
  id: string
  patient_name: string
  date: string
  time: string
  status: 'completed' | 'pending' | 'cancelled'
  type: string
}

export default function DoctorDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const doctorId = params.id as string
  
  const [doctor, setDoctor] = useState<DoctorDetails | null>(null)
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("info")
  
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    if (doctorId) {
      loadDoctorDetails()
      loadConsultations()
    }
  }, [doctorId])

  const loadDoctorDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*, profiles!doctors_user_id_fkey(profile_completed)')
        .eq('id', doctorId)
        .single()
      
      if (error) throw error
      
      setDoctor({
        ...data,
        profile_completed: data.profiles?.profile_completed || false
      })
    } catch (err) {
      console.error('Error loading doctor details:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadConsultations = async () => {
    // Mock consultations for now
    const mockConsultations: Consultation[] = [
      {
        id: '1',
        patient_name: 'Marie Laurent',
        date: '2024-01-15',
        time: '09:00',
        status: 'completed',
        type: 'Consultation générale'
      },
      {
        id: '2',
        patient_name: 'Pierre Martin',
        date: '2024-01-15',
        time: '10:30',
        status: 'pending',
        type: 'Suivi'
      },
      {
        id: '3',
        patient_name: 'Sophie Durand',
        date: '2024-01-15',
        time: '14:00',
        status: 'pending',
        type: 'Première consultation'
      }
    ]
    setConsultations(mockConsultations)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Terminée</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Annulée</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const todayConsultations = consultations.filter(c => c.date === new Date().toISOString().split('T')[0])
  const completedToday = todayConsultations.filter(c => c.status === 'completed').length
  const pendingToday = todayConsultations.filter(c => c.status === 'pending').length

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>
  }

  if (!doctor) {
    return <div className="text-center py-8">Médecin non trouvé</div>
  }

  return (
    <div className="p-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour
      </Button>

      <div className="grid gap-6 mb-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{doctor.full_name}</CardTitle>
                <p className="text-gray-600 mt-1">{doctor.specialty || 'Spécialité non renseignée'}</p>
              </div>
              <Badge
                variant={doctor.profile_completed ? "default" : "destructive"}
                className="ml-4"
              >
                {doctor.profile_completed ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Profil complet
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Profil incomplet
                  </>
                )}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{completedToday}</div>
              <p className="text-sm text-gray-600 mt-1">Consultations terminées aujourd'hui</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">{pendingToday}</div>
              <p className="text-sm text-gray-600 mt-1">Consultations en attente</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">4.8</div>
              <p className="text-sm text-gray-600 mt-1">Note moyenne</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">127</div>
              <p className="text-sm text-gray-600 mt-1">Total consultations</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{doctor.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="font-medium">{doctor.phone_number || 'Non renseigné'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">N° Medical Council</p>
                    <p className="font-medium">{doctor.medical_council_number || 'Non renseigné'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Expérience</p>
                    <p className="font-medium">{doctor.years_experience || 'Non renseigné'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Membre depuis</p>
                    <p className="font-medium">{new Date(doctor.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Langues</p>
                    <p className="font-medium">{doctor.languages || 'Non renseigné'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consultations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Consultations du jour</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consultations.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Aucune consultation aujourd'hui</p>
                ) : (
                  consultations.map((consultation) => (
                    <div key={consultation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{consultation.patient_name}</p>
                          <p className="text-sm text-gray-500">{consultation.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{consultation.time}</p>
                          <p className="text-xs text-gray-500">{consultation.date}</p>
                        </div>
                        {getStatusBadge(consultation.status)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Diplôme de médecine</p>
                      <p className="text-sm text-gray-500">PDF • 2.3 MB</p>
                    </div>
                  </div>
                  <Badge variant={doctor.profile_completed ? "default" : "secondary"}>
                    {doctor.profile_completed ? 'Vérifié' : 'En attente'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Certificat Medical Council</p>
                      <p className="text-sm text-gray-500">PDF • 1.8 MB</p>
                    </div>
                  </div>
                  <Badge variant={doctor.profile_completed ? "default" : "secondary"}>
                    {doctor.profile_completed ? 'Vérifié' : 'En attente'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
