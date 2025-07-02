"use client"

import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, User, Circle } from "lucide-react"
import Link from "next/link"

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
      
      // Mock status for now - you can implement real-time status later
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
      // Create doctor account using admin privileges
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newDoctor.email,
        password: newDoctor.password,
        email_confirm: true,
        user_metadata: {
          full_name: newDoctor.full_name,
          role: 'doctor'
        }
      })

      if (authError) throw authError

      // The doctor record will be created automatically by the trigger
      // Refresh the list
      await loadDoctors()
      
      // Reset form and close dialog
      setNewDoctor({ full_name: "", email: "", password: "" })
      setShowAddDialog(false)
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'ajout du médecin")
    } finally {
      setAddingDoctor(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'consultation': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'En ligne'
      case 'consultation': return 'En consultation'
      case 'offline': return 'Hors ligne'
      default: return 'Inconnu'
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
        <div className="text-lg">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Médecins</h1>
        <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un médecin
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Rechercher par nom, email ou spécialité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredDoctors.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Aucun médecin trouvé</p>
            </CardContent>
          </Card>
        ) : (
          filteredDoctors.map((doctor) => (
            <Link href={`/admin/doctors/${doctor.id}`} key={doctor.id}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="flex items-center justify-between p-6">
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
                      <p className="text-sm text-gray-500">Consultations aujourd&apos;hui</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Circle className={`w-3 h-3 fill-current ${getStatusColor(doctor.status)}`} />
                      <Badge variant="secondary" className="min-w-[120px] justify-center">
                        {getStatusText(doctor.status)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau médecin</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom complet</label>
              <Input
                value={newDoctor.full_name}
                onChange={(e) => setNewDoctor({ ...newDoctor, full_name: e.target.value })}
                placeholder="Dr. Jean Dupont"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email professionnel</label>
              <Input
                type="email"
                value={newDoctor.email}
                onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                placeholder="dr.dupont@tibok.mu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mot de passe temporaire</label>
              <Input
                type="password"
                value={newDoctor.password}
                onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })}
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 mt-1">Le médecin devra changer ce mot de passe à la première connexion</p>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleAddDoctor} 
              disabled={addingDoctor || !newDoctor.full_name || !newDoctor.email || !newDoctor.password}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {addingDoctor ? "Création..." : "Créer le compte"}
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </div>
  )
}
