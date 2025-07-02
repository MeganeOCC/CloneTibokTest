"use client"

import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  Save,
  Upload,
  FileText,
  Check,
  X,
  User,
  Mail,
  Phone,
  Award,
  Calendar,
  Globe
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface DoctorProfile {
  id: string
  user_id: string
  full_name: string
  email: string
  phone_number: string
  specialty: string
  medical_council_number: string
  years_experience: string
  languages: string[]
}

interface ProfileCompletion {
  personalInfo: boolean
  documents: boolean
  overall: boolean
}

export default function DoctorProfilePage() {
  const { language } = useLanguage()
  const [profile, setProfile] = useState<DoctorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [completion, setCompletion] = useState<ProfileCompletion>({
    personalInfo: false,
    documents: false,
    overall: false
  })
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone_number: "",
    specialty: "",
    medical_council_number: "",
    years_experience: "",
    languages: [] as string[]
  })

  const [documents, setDocuments] = useState({
    diploma: null as File | null,
    medical_council_cert: null as File | null,
    specialty_certs: [] as File[],
    profile_photo: null as File | null
  })

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) throw error

      if (data) {
        setProfile(data)
        
        // Parse full name
        const nameParts = data.full_name?.split(' ') || []
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''
        
        // Parse languages
        const languages = data.languages ? data.languages.split(', ') : []
        
        setFormData({
          firstName,
          lastName,
          phone_number: data.phone_number || '',
          specialty: data.specialty || '',
          medical_council_number: data.medical_council_number || '',
          years_experience: data.years_experience || '',
          languages
        })

        // Check profile completion
        checkProfileCompletion(data)
      }
    } catch (err) {
      console.error('Error loading profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const checkProfileCompletion = (data: any) => {
    const personalInfoComplete = !!(
      data.full_name &&
      data.phone_number &&
      data.specialty &&
      data.medical_council_number &&
      data.years_experience &&
      data.languages
    )

    // For now, assume documents are incomplete if profile is not marked as complete
    const documentsComplete = false // Will be implemented with actual file storage

    setCompletion({
      personalInfo: personalInfoComplete,
      documents: documentsComplete,
      overall: personalInfoComplete && documentsComplete
    })

    // Update profile completion status
    if (personalInfoComplete && documentsComplete) {
      updateProfileCompletionStatus(true)
    }
  }

  const updateProfileCompletionStatus = async (completed: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await supabase
        .from('profiles')
        .update({ profile_completed: completed })
        .eq('id', user.id)
    } catch (err) {
      console.error('Error updating profile completion:', err)
    }
  }

  const handleSavePersonalInfo = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const fullName = `${formData.firstName} ${formData.lastName}`.trim()
      const languagesStr = formData.languages.join(', ')

      const { error } = await supabase
        .from('doctors')
        .update({
          full_name: fullName,
          phone_number: formData.phone_number,
          specialty: formData.specialty,
          medical_council_number: formData.medical_council_number,
          years_experience: formData.years_experience,
          languages: languagesStr
        })
        .eq('user_id', user.id)

      if (error) throw error

      // Reload profile to check completion
      await loadProfile()
      
      alert(language === 'fr' ? 'Informations sauvegardées avec succès' : 'Information saved successfully')
    } catch (err) {
      console.error('Error saving profile:', err)
      alert(language === 'fr' ? 'Erreur lors de la sauvegarde' : 'Error saving information')
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = (type: keyof typeof documents, files: FileList | null) => {
    if (!files || files.length === 0) return

    if (type === 'specialty_certs') {
      setDocuments(prev => ({
        ...prev,
        specialty_certs: [...prev.specialty_certs, ...Array.from(files)]
      }))
    } else {
      setDocuments(prev => ({
        ...prev,
        [type]: files[0]
      }))
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {language === 'fr' ? 'Mon Profil' : 'My Profile'}
      </h1>

      {!completion.overall && (
        <Alert className="mb-6 border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            {language === 'fr' 
              ? 'Votre profil est incomplet. Veuillez remplir toutes les informations et télécharger les documents requis.'
              : 'Your profile is incomplete. Please fill in all information and upload required documents.'}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className={completion.personalInfo ? 'border-green-200' : 'border-red-200'}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Informations personnelles</p>
                <p className="text-lg font-semibold">
                  {completion.personalInfo ? 'Complétées' : 'Incomplètes'}
                </p>
              </div>
              {completion.personalInfo ? (
                <Check className="w-8 h-8 text-green-500" />
              ) : (
                <X className="w-8 h-8 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className={completion.documents ? 'border-green-200' : 'border-red-200'}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Documents</p>
                <p className="text-lg font-semibold">
                  {completion.documents ? 'Téléchargés' : 'Manquants'}
                </p>
              </div>
              {completion.documents ? (
                <Check className="w-8 h-8 text-green-500" />
              ) : (
                <X className="w-8 h-8 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className={completion.overall ? 'border-green-200' : 'border-yellow-200'}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Statut du profil</p>
                <p className="text-lg font-semibold">
                  {completion.overall ? 'Complet' : 'En attente'}
                </p>
              </div>
              {completion.overall ? (
                <Check className="w-8 h-8 text-green-500" />
              ) : (
                <AlertCircle className="w-8 h-8 text-yellow-500" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal">Informations Personnelles</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations Personnelles</CardTitle>
              <CardDescription>
                Complétez vos informations professionnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Prénom</label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Jean"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Dupont"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email professionnel</label>
                <Input
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Téléphone</label>
                <Input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  placeholder="+230 XXXX XXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Numéro Medical Council Maurice</label>
                <Input
                  value={formData.medical_council_number}
                  onChange={(e) => setFormData({ ...formData, medical_council_number: e.target.value })}
                  placeholder="MCM-XXXX"
                />
                <p className="text-xs text-gray-500 mt-1">Numéro d'enregistrement obligatoire</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Spécialité principale</label>
                <Select
                  value={formData.specialty}
                  onValueChange={(value) => setFormData({ ...formData, specialty: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une spécialité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Médecine Générale</SelectItem>
                    <SelectItem value="cardiology">Cardiologie</SelectItem>
                    <SelectItem value="dermatology">Dermatologie</SelectItem>
                    <SelectItem value="pediatrics">Pédiatrie</SelectItem>
                    <SelectItem value="psychiatry">Psychiatrie</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Années d'expérience</label>
                <Select
                  value={formData.years_experience}
                  onValueChange={(value) => setFormData({ ...formData, years_experience: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-2">0-2 ans</SelectItem>
                    <SelectItem value="3-5">3-5 ans</SelectItem>
                    <SelectItem value="6-10">6-10 ans</SelectItem>
                    <SelectItem value="10+">Plus de 10 ans</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Langues parlées</label>
                <div className="space-y-2">
                  {['fr', 'en', 'creole', 'hindi'].map((lang) => (
                    <div key={lang} className="flex items-center">
                      <Checkbox
                        id={lang}
                        checked={formData.languages.includes(lang)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({ ...formData, languages: [...formData.languages, lang] })
                          } else {
                            setFormData({ ...formData, languages: formData.languages.filter(l => l !== lang) })
                          }
                        }}
                      />
                      <label htmlFor={lang} className="ml-2 text-sm">
                        {lang === 'fr' ? 'Français' : lang === 'en' ? 'Anglais' : lang === 'creole' ? 'Créole' : 'Hindi'}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSavePersonalInfo}
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Enregistrement...' : 'Enregistrer les informations'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents Requis</CardTitle>
              <CardDescription>
                Téléchargez vos documents officiels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Diplôme de Médecine</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <label htmlFor="diploma" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-blue-600">
                      Choisir un fichier
                    </span>
                    <input
                      id="diploma"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('diploma', e.target.files)}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (max 10MB)</p>
                  {documents.diploma && (
                    <p className="text-sm text-green-600 mt-2">
                      <Check className="inline w-4 h-4 mr-1" />
                      {documents.diploma.name}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Certificat Medical Council Maurice</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <label htmlFor="medical-council" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-blue-600">
                      Choisir un fichier
                    </span>
                    <input
                      id="medical-council"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('medical_council_cert', e.target.files)}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (max 10MB)</p>
                  {documents.medical_council_cert && (
                    <p className="text-sm text-green-600 mt-2">
                      <Check className="inline w-4 h-4 mr-1" />
                      {documents.medical_council_cert.name}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Certifications Spécialisées (optionnel)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <label htmlFor="specialty-certs" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-blue-600">
                      Choisir des fichiers
                    </span>
                    <input
                      id="specialty-certs"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.jpg,.jpeg,.png"
                      multiple
                      onChange={(e) => handleFileUpload('specialty_certs', e.target.files)}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Plusieurs fichiers acceptés</p>
                  {documents.specialty_certs.length > 0 && (
                    <div className="mt-2">
                      {documents.specialty_certs.map((file, index) => (
                        <p key={index} className="text-sm text-green-600">
                          <Check className="inline w-4 h-4 mr-1" />
                          {file.name}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Photo de Profil</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <label htmlFor="profile-photo" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-blue-600">
                      Choisir un fichier
                    </span>
                    <input
                      id="profile-photo"
                      type="file"
                      className="sr-only"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('profile_photo', e.target.files)}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG (max 5MB)</p>
                  {documents.profile_photo && (
                    <p className="text-sm text-green-600 mt-2">
                      <Check className="inline w-4 h-4 mr-1" />
                      {documents.profile_photo.name}
                    </p>
                  )}
                </div>
              </div>

              <Button
                disabled={!documents.diploma || !documents.medical_council_cert}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Soumettre les documents
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
