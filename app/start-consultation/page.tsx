// In app/start-consultation/page.tsx, look for queries that might be causing the error

// 1. When checking if user exists, DON'T query subscription_status from profiles
// WRONG:
const { data: existingProfile } = await supabase
  .from('profiles')
  .select('*, subscription_status') // ❌ This will cause the error
  .eq('email', email)
  .single()

// CORRECT - Just query profiles:
const { data: existingProfile } = await supabase
  .from('profiles')
  .select('*')
  .eq('email', email)
  .single()

// 2. To get subscription info, use the patient_subscription_status view:
const { data: patientStatus } = await supabase
  .from('patient_subscription_status')
  .select('*')
  .eq('email', email)
  .single()

// 3. Or query subscriptions separately through patients table:
const { data: patientData } = await supabase
  .from('patients')
  .select(`
    *,
    subscriptions(*)
  `)
  .eq('email', email)
  .single()

// 4. For the signup process, ensure you're creating records in the right order:
const handleSignup = async (email: string, password: string, userData: any) => {
  try {
    // Step 1: Create auth user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${userData.firstName} ${userData.lastName}`,
          role: 'patient'
        }
      }
    })

    if (signUpError) throw signUpError

    // Step 2: The trigger should create the profile automatically
    // But if needed, manually create it:
    if (authData.user) {
      // Wait a moment for trigger to execute
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check if profile was created
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (!profile) {
        // Manually create if trigger failed
        await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: authData.user.email,
            role: 'patient',
            full_name: `${userData.firstName} ${userData.lastName}`,
            profile_completed: false
          })
      }

      // Step 3: Create patient record
      const { error: patientError } = await supabase
        .from('patients')
        .insert({
          user_id: authData.user.id,
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: authData.user.email,
          phone_number: userData.phone,
          // ... other fields
        })

      if (patientError) throw patientError

      // Step 4: The subscription should be created by trigger
      // But can be created manually if needed
    }

    return { success: true, user: authData.user }
  } catch (error) {
    console.error('Signup error:', error)
    return { success: false, error }
  }
}
