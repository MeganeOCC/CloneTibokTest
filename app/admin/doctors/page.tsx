"use client"

import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Plus, Search, User, Circle } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

interface Doctor {
  id: string
  user_id: string
  full_name: string
  email: string
  specialty: string
  status: 'online' | 'offline' | 'consultation'
  consultations_today: number
  created_at: string
}

export default function AdminDoctorsPage() {
  const { language } = useLanguage()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newDoctor, setNewDoctor] = useState({
    full_name: "",
    email: "",
    password: ""
  })
  const [addingDoctor, setAddingDoctor] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    loadDoctors()
  }, [])

  const loadDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      const doctorsWithStatus = data?.map(doc => ({
        ...doc,
        status: Math.random() > 0.7 ? 'online' : Math.random() > 0.5 ? 'consultation' : 'offline',
        consultations_today: Math.floor(Math.random() * 15)
      })) || []
      
      setDoctors(doctorsWithStatus as Doctor[])
    } catch (err) {
      console.error('Error loading doctors:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddDoctor = async () => {
    setError(null)
    setAddingDoctor(true)

    try {
      console.log('Creating doctor with data:', newDoctor)
      
      const { data, error } = await supabase.rpc('admin_create_doctor', {
        p_email: newDoctor.email,
        p_password: newDoctor.password,
        p_full_name: newDoctor.full_name
      })

      console.log('RPC response:', { data, error })

      if (error) {
        console.error('Supabase RPC error:', error)
        throw new Error(error.message)
      }

      if (data && data.success) {
        console.log('Doctor created successfully:', data)
        
        await loadDoctors()
        
        setNewDoctor({ full_name: "", email: "", password: "" })
        setShowAddDialog(false)
        
        alert(language === 'fr' ? 'Médecin créé avec succès!' : 'Doctor created successfully!')
      } else {
        console.error('Function returned error:', data)
        throw new Error(data?.message || (language === 'fr' ? 'Erreur lors de la création du médecin' : 'Error creating doctor'))
      }

    } catch (err: any) {
      console.error('Error creating doctor:', err)
      setError(err.message || (language === 'fr' ? "Erreur lors de l'ajout du médecin" : "Error adding doctor"))
    } finally {
      setAddingDoctor(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'consultation': return 'bg-blue-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    if (language === 'fr') {
      switch (status) {
        case 'online': return 'En ligne'
        case 'consultation': return 'En consultation'
        case 'offline': return 'Hors ligne'
        default: return 'Inconnu'
      }
    } else {
      switch (status) {
        case 'online': return 'Online'
        case 'consultation': return 'In consultation'
        case 'offline': return 'Offline'
        default: return 'Unknown'
      }
    }
  }

  const filteredDoctors = doctors.filter(doctor =>
    doctor.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">{language === 'fr' ? 'Chargement...' : 'Loading...'}</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {language === 'fr' ? 'Gestion des Médecins' : 'Doctors Management'}
        </h1>
        <button 
          onClick={() => setShowAddDialog(true)} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          {language === 'fr' ? 'Ajouter un médecin' : 'Add a doctor'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={language === 'fr' ? 'Rechercher par nom, email ou spécialité...' : 'Search by name, email or specialty...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">
              {language === 'fr' ? 'Aucun médecin trouvé' : 'No doctors found'}
            </p>
          </div>
        ) : (
          filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="mb-6 last:mb-0">
              <Link href={`/admin/doctors/${doctor.id}`} className="block">
                <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{doctor.full_name}</h3>
                        <p className="text-sm text-gray-600">{doctor.email}</p>
                        {doctor.specialty && (
                          <p className="text-sm text-gray-500 mt-1">{doctor.specialty}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{doctor.consultations_today}</p>
                        <p className="text-sm text-gray-500">
                          {language === 'fr' ? 'Consultations aujourd\'hui' : 'Consultations today'}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(doctor.status)}`} />
                        <span className="text-sm font-medium">
                          {getStatusText(doctor.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>

      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">
              {language === 'fr' ? 'Ajouter un nouveau médecin' : 'Add a new doctor'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === 'fr' ? 'Nom complet' : 'Full name'}
                </label>
                <input
                  type="text"
                  value={newDoctor.full_name}
                  onChange={(e) => setNewDoctor({ ...newDoctor, full_name: e.target.value })}
                  placeholder={language === 'fr' ? 'Dr. Jean Dupont' : 'Dr. John Doe'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === 'fr' ? 'Email professionnel' : 'Professional email'}
                </label>
                <input
                  type="email"
                  value={newDoctor.email}
                  onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                  placeholder={language === 'fr' ? 'dr.dupont@tibok.mu' : 'dr.doe@tibok.mu'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === 'fr' ? 'Mot de passe temporaire' : 'Temporary password'}
                </label>
                <input
                  type="password"
                  value={newDoctor.password}
                  onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {language === 'fr' 
                    ? 'Le médecin devra changer ce mot de passe à la première connexion' 
                    : 'The doctor will need to change this password on first login'}
                </p>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                {language === 'fr' ? 'Annuler' : 'Cancel'}
              </button>
              <button
                onClick={handleAddDoctor}
                disabled={addingDoctor || !newDoctor.full_name || !newDoctor.email || !newDoctor.password}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingDoctor 
                  ? (language === 'fr' ? 'Création...' : 'Creating...') 
                  : (language === 'fr' ? 'Créer le compte' : 'Create account')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
