export type Language = "fr" | "en"

export const translations = {
  fr: {
    // Header
    medicalExcellence: "Excellence médicale à Maurice",
    navHome: "Accueil",
    navServices: "Services",
    navPricing: "Tarifs",
    navAbout: "À Propos",
    navContact: "Contact",
    consultationButton: "Consultation",
    // Hero
    heroTitle: "TIBOK, votre plateforme de télémédecine à Maurice",
    heroSubtitle: "Consultations vidéo • Ordonnances numériques • Livraison médicaments • Second avis international",
    startConsultationButton: "Commencer une consultation",
    // Services
    servicesTitle: "Nos Services",
    service1Title: "Consultation Médicale",
    service1Desc: "Consultations vidéo immédiates avec nos médecins",
    service2Title: "Livraison Médicaments",
    service2Desc: "Livraison sécurisée de vos médicaments à domicile",
    service3Title: "Second Avis Médical",
    service3Desc: "Avis d'experts médicaux pour confirmer un diagnostic",
    service4Title: "Chatbot IA",
    service4Desc: "Assistant intelligent disponible 24h/24",
    // Process
    processTitle: "Comment ça marche",
    processStep1Title: "Inscription",
    processStep1Desc: "Création de compte sécurisé et profil médical",
    processStep2Title: "Consultation Vidéo",
    processStep2Desc: "Rendez-vous en ligne avec médecin agréé",
    processStep3Title: "Prescription Numérique",
    processStep3Desc: "Ordonnance électronique sécurisée",
    processStep4Title: "Livraison",
    processStep4Desc: "Médicaments livrés à domicile",
    // Pricing
    pricingTitle: "Nos Tarifs",
    pricingPlan1Title: "À l'acte",
    pricingPlan1PriceMUR: "1 000 MUR",
    pricingPlan1Residents: "Résidents Maurice",
    pricingPlan1PriceEUR: "35 €",
    pricingPlan1Tourists: "Touristes",
    pricingPlan1Feature1: "Consultation par session",
    pricingPlan1Feature2: "Livraison payante",
    pricingPlan1Button: "Commencer",
    pricingPlan2Title: "Pack Solo",
    pricingPlan2Price: "800 MUR",
    pricingPlan2PerMonth: "/mois",
    pricingPlan2Feature1: "1 consultation comprise",
    pricingPlan2Feature2: "Livraison gratuite",
    pricingPlan2Feature3: "Prescription numérique",
    pricingPlan2Button: "S'abonner",
    pricingPlan4Title: "Second avis médical expert",
    pricingPlan4Description: "Consultation avec spécialistes internationaux",
    pricingPlan4PriceMUR: "À partir de 4 500 MUR",
    pricingPlan4PriceNote: "Selon spécialité",
    pricingPlan4Feature1: "Recherche spécialiste",
    pricingPlan4Feature2: "Matching automatique",
    pricingPlan4Feature3: "Consultation expert",
    pricingPlan4Feature4: "Médecins spécialisés",
    pricingPlan4Feature5: "Rapport détaillé",
    pricingPlan4Feature6: "Analyse complète",
    pricingPlan4Button: "Demander un avis",
    paymentMethodsTitle: "Moyens de Paiement Acceptés",

    // ... (all other translations, unchanged, from your original file)
    // Just make sure NO Family/Famille references remain anywhere in the object
    // Example: dashboardPlanFamily, pricingPlan3Title, pricingFamilyPackTitle, etc. are all removed.

    // Subscription & location - **NEW KEYS START**
    subscriptionTypePayPerUse: "À l'acte",
    subscriptionTypeSolo: "Pack Solo",
    subscriptionTypeSecondOpinion: "Second avis médical",
    patientLocationLocal: "Résident Mauricien",
    patientLocationExpat: "Expatrié/Touriste",
    consultationLimitReached: "Limite mensuelle atteinte",
    consultationPayPerUseAvailable: "Vous pouvez réserver une consultation à l'acte",
    consultationIncludedInPlan: "Inclus dans votre abonnement",
    dashboardConsultationsRemaining: "{count} consultation(s) restante(s) ce mois",
    dashboardBookPayPerUse: "Réserver une consultation à l'acte"
  },
  en: {
    // Header
    medicalExcellence: "Medical Excellence in Mauritius",
    navHome: "Home",
    navServices: "Services",
    navPricing: "Pricing",
    navAbout: "About",
    navContact: "Contact",
    consultationButton: "Consultation",
    heroTitle: "TIBOK, your telemedicine platform in Mauritius",
    heroSubtitle: "Video consultations • Digital prescriptions • Medicine delivery • International second opinion",
    startConsultationButton: "Start consultation",
    servicesTitle: "Our Services",
    service1Title: "Medical Consultation",
    service1Desc: "Immediate video consultations with our doctors",
    service2Title: "Medicine Delivery",
    service2Desc: "Safe delivery of your medicines at home",
    service3Title: "Second Medical Opinion",
    service3Desc: "Expert medical opinions to confirm diagnosis",
    service4Title: "AI Chatbot",
    service4Desc: "Smart assistant available 24/7",
    processTitle: "How it works",
    processStep1Title: "Registration",
    processStep1Desc: "Secure account creation and medical profile",
    processStep2Title: "Video Consultation",
    processStep2Desc: "Online appointment with certified doctor",
    processStep3Title: "Digital Prescription",
    processStep3Desc: "Secure electronic prescription",
    processStep4Title: "Delivery",
    processStep4Desc: "Medicines delivered at home",
    pricingTitle: "Our Pricing",
pricingPlan1Title: "Pay-per-use",
pricingPlan1PriceMUR: "1,000 MUR",
pricingPlan1Residents: "Mauritius Residents",
pricingPlan1PriceEUR: "€35",
pricingPlan1Tourists: "Tourists",
pricingPlan1Feature1: "Consultation per session",
pricingPlan1Feature2: "Paid delivery",
pricingPlan1Button: "Get Started",

pricingPlan2Title: "Solo Pack",
pricingPlan2Price: "800 MUR",
pricingPlan2PerMonth: "/month",
pricingPlan2Feature1: "1 consultation included",
pricingPlan2Feature2: "Free delivery",
pricingPlan2Feature3: "Digital prescription",
pricingPlan2Button: "Subscribe",

pricingPlan4Title: "Second medical expert opinion",
pricingPlan4Description: "Consultation with international specialists",
pricingPlan4PriceMUR: "From 4,500 MUR",
pricingPlan4PriceNote: "According to specialty",
pricingPlan4Feature1: "Specialist search",
pricingPlan4Feature2: "Automatic matching",
pricingPlan4Feature3: "Expert consultation",
pricingPlan4Feature4: "Specialized doctors",
pricingPlan4Feature5: "Detailed report",
pricingPlan4Feature6: "Complete analysis",
pricingPlan4Button: "Request an opinion",

paymentMethodsTitle: "Accepted Payment Methods",


    continueButton: "Continue",
    patientInfoTitle: "Patient Information",
    patientInfoSubtitle: "Complete your medical profile",

    // ... (all other translations, unchanged, from your original file)
    // Just make sure NO Family/Famille references remain anywhere in the object
    // Example: dashboardPlanFamily, pricingPlan3Title, pricingFamilyPackTitle, etc. are all removed.

    // Subscription & location - **NEW KEYS START**
    subscriptionTypePayPerUse: "Pay-per-use",
    subscriptionTypeSolo: "Solo Pack",
    subscriptionTypeSecondOpinion: "Second medical opinion",
    patientLocationLocal: "Mauritian Resident",
    patientLocationExpat: "Expat/Tourist",
    consultationLimitReached: "Monthly limit reached",
    consultationPayPerUseAvailable: "You can book a pay-per-use consultation",
    consultationIncludedInPlan: "Included in your plan",
    dashboardConsultationsRemaining: "{count} consultation(s) remaining this month",
    dashboardBookPayPerUse: "Book a pay-per-use consultation"
  }
} as const

export type AvailableLanguage = keyof typeof translations
