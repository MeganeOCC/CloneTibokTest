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
      </CardContent>
    </Card>
  )
}
