"use client"

import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface DoctorProfile {
  id: string
  user_id: string
  full_name: string
  email: string
  phone_number: string
  specialty: string
  medical_council_number: string
  years_experience: string
  languages: string
}

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState<DoctorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  
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
        
        // Parse languages - handle both string and array
        let languages = []
        if (data.languages) {
          if (typeof data.languages === 'string') {
            languages = data.languages.split(', ')
          } else if (Array.isArray(data.languages)) {
            languages = data.languages
          }
        }
        
        setFormData({
          firstName,
          lastName,
          phone_number: data.phone_number || '',
          specialty: data.specialty || '',
          medical_council_number: data.medical_council_number || '',
          years_experience: data.years_experience || '',
          languages
        })
      }
    } catch (err) {
      console.error('Error loading profile:', err)
    } finally {
      setLoading(false)
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

      await loadProfile()
      alert('Informations sauvegardées avec succès')
    } catch (err) {
      console.error('Error saving profile:', err)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = (type: keyof typeof documents, files: FileList | null) => {
    if (!files || files.length === 0) return
    setDocuments(prev => ({
      ...prev,
      [type]: files[0]
    }))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>

      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => setActiveTab("personal")}
          className={`px-4 py-2 rounded-t-lg font-medium ${
            activeTab === "personal" 
              ? "bg-blue-600 text-white" 
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Informations Personnelles
        </button>
        <button
          onClick={() => setActiveTab("documents")}
          className={`px-4 py-2 rounded-t-lg font-medium ${
            activeTab === "documents" 
              ? "bg-blue-600 text-white" 
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Documents
        </button>
      </div>

      {activeTab === "personal" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Informations Personnelles</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Prénom</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Jean"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Dupont"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email professionnel</label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Téléphone</label>
              <input
                type="tel"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                placeholder="+230 XXXX XXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Numéro Medical Council Maurice</label>
              <input
                type="text"
                value={formData.medical_council_number}
                onChange={(e) => setFormData({ ...formData, medical_council_number: e.target.value })}
                placeholder="MCM-XXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Numéro d'enregistrement obligatoire</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Spécialité principale</label>
              <select
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner une spécialité</option>
                <option value="general">Médecine Générale</option>
                <option value="cardiology">Cardiologie</option>
                <option value="dermatology">Dermatologie</option>
                <option value="pediatrics">Pédiatrie</option>
                <option value="psychiatry">Psychiatrie</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Années d'expérience</label>
              <select
                value={formData.years_experience}
                onChange={(e) => setFormData({ ...formData, years_experience: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="0-2">0-2 ans</option>
                <option value="3-5">3-5 ans</option>
                <option value="6-10">6-10 ans</option>
                <option value="10+">Plus de 10 ans</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Langues parlées</label>
              <div className="space-y-2">
                {[
                  { value: 'fr', label: 'Français' },
                  { value: 'en', label: 'Anglais' },
                  { value: 'creole', label: 'Créole' },
                  { value: 'hindi', label: 'Hindi' }
                ].map((lang) => (
                  <div key={lang.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={lang.value}
                      checked={formData.languages.includes(lang.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, languages: [...formData.languages, lang.value] })
                        } else {
                          setFormData({ ...formData, languages: formData.languages.filter(l => l !== lang.value) })
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={lang.value} className="ml-2 text-sm">
                      {lang.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSavePersonalInfo}
              disabled={saving}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer les informations'}
            </button>
          </div>
        </div>
      )}

      {activeTab === "documents" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Documents Requis</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Diplôme de Médecine</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <div className="text-4xl mb-2">📄</div>
                <label htmlFor="diploma" className="cursor-pointer">
                  <span className="text-blue-600 font-medium">Choisir un fichier</span>
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
                    ✓ {documents.diploma.name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Certificat Medical Council Maurice</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <div className="text-4xl mb-2">📄</div>
                <label htmlFor="medical-council" className="cursor-pointer">
                  <span className="text-blue-600 font-medium">Choisir un fichier</span>
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
                    ✓ {documents.medical_council_cert.name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Photo de Profil</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <div className="text-4xl mb-2">📸</div>
                <label htmlFor="profile-photo" className="cursor-pointer">
                  <span className="text-blue-600 font-medium">Choisir un fichier</span>
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
                    ✓ {documents.profile_photo.name}
                  </p>
                )}
              </div>
            </div>

            <button
              disabled={!documents.diploma || !documents.medical_council_cert}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Soumettre les documents
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
