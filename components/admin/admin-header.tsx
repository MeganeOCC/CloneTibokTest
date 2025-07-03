"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

interface AdminHeaderProps {
  onMenuClick?: () => void
  isSidebarOpen?: boolean
}

export function AdminHeader({ onMenuClick, isSidebarOpen }: AdminHeaderProps) {
  const { language, setLanguage } = useLanguage()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="flex items-center ml-4 lg:ml-0">
              <h1 className="text-xl font-semibold text-gray-900">TIBOK Admin Center</h1>
              <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                {language === 'fr' ? 'Système en ligne' : 'System online'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <Button
                variant={language === 'fr' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('fr')}
                className={language === 'fr' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'hover:bg-gray-100'}
              >
                FR
              </Button>
              <Button
                variant={language === 'en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('en')}
                className={language === 'en' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'hover:bg-gray-100'}
              >
                EN
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
              <span className="text-sm font-medium text-gray-700">Admin TIBOK</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
