const handleAddDoctor = async () => {
  setError(null)
  setAddingDoctor(true)

  try {
    // Use our custom admin function with .rpc()
    const { data, error } = await supabase.rpc('admin_create_doctor', {
      p_email: newDoctor.email,
      p_password: newDoctor.password,
      p_full_name: newDoctor.full_name
    })

    // Check for Supabase RPC errors
    if (error) {
      console.error('Supabase RPC error:', error)
      throw new Error(error.message)
    }

    // Check the result from our function
    if (data && data.success) {
      console.log('Doctor created successfully:', data)
      
      // Refresh the doctors list
      await loadDoctors()
      
      // Reset form and close dialog
      setNewDoctor({ full_name: "", email: "", password: "" })
      setShowAddDialog(false)
      
      // Show success message
      alert('Médecin créé avec succès!')
    } else {
      // Function returned an error
      console.error('Function returned error:', data)
      throw new Error(data?.message || 'Erreur lors de la création du médecin')
    }

  } catch (err: any) {
    console.error('Error creating doctor:', err)
    setError(err.message || "Erreur lors de l'ajout du médecin")
  } finally {
    setAddingDoctor(false)
  }
}
