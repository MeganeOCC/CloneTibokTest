// Add these functions to your doctor dashboard layout or create a separate utility file

import { getSupabaseBrowserClient } from "@/lib/supabase/client"

// Update doctor status
export async function updateDoctorStatus(status: 'online' | 'offline' | 'consultation') {
  const supabase = getSupabaseBrowserClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    // Update the doctor's status in the doctors table
    const { error } = await supabase
      .from('doctors')
      .update({ 
        status: status,
        last_seen: new Date().toISOString()
      })
      .eq('user_id', user.id)
    
    if (error) {
      console.error('Error updating doctor status:', error)
    } else {
      console.log('Doctor status updated to:', status)
    }
  } catch (error) {
    console.error('Error in updateDoctorStatus:', error)
  }
}

// Set doctor online when they log in
export async function setDoctorOnline() {
  await updateDoctorStatus('online')
}

// Set doctor offline when they log out
export async function setDoctorOffline() {
  await updateDoctorStatus('offline')
}

// Set doctor in consultation when they start a consultation
export async function setDoctorInConsultation() {
  await updateDoctorStatus('consultation')
}

// In your doctor dashboard layout, add these calls:

// When the component mounts (after successful auth check):
useEffect(() => {
  const initializeDoctor = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await setDoctorOnline() // Set status to online when doctor logs in
      fetchDoctorProfile()
    } else {
      router.push('/doctor')
    }
  }
  
  initializeDoctor()
  
  // Set doctor offline when they close the tab/window
  const handleBeforeUnload = () => {
    setDoctorOffline()
  }
  
  window.addEventListener('beforeunload', handleBeforeUnload)
  
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
    setDoctorOffline() // Set offline when component unmounts
  }
}, [])

// Update the logout function:
const handleLogout = async () => {
  await setDoctorOffline() // Set status to offline before logging out
  await supabase.auth.signOut()
  router.push('/doctor')
}
