import React, { useState, useEffect } from 'react'
import './PWAInstallPrompt.css'

function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         window.navigator.standalone === true ||
                         (window.matchMedia('(display-mode: fullscreen)').matches)
    
    if (isStandalone) {
      setIsInstalled(true)
      return
    }

    // Vérifier si les icônes sont présentes (requis pour l'installation)
    const checkIcons = async () => {
      try {
        const icon192 = await fetch('/icon-192.png', { method: 'HEAD' })
        const icon512 = await fetch('/icon-512.png', { method: 'HEAD' })
        
        if (!icon192.ok || !icon512.ok) {
          console.warn('Les icônes PWA ne sont pas présentes. L\'installation ne sera pas disponible.')
          return
        }
      } catch (error) {
        console.warn('Erreur lors de la vérification des icônes:', error)
        return
      }
    }
    
    checkIcons()

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Écouter les changements de connexion
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setShowPrompt(false)
      setIsInstalled(true)
    }
    
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Ne plus afficher pendant cette session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true')
  }

  // Ne pas afficher si l'utilisateur a déjà rejeté dans cette session
  if (sessionStorage.getItem('pwa-prompt-dismissed') === 'true') {
    return null
  }

  if (isInstalled || !showPrompt) {
    return null
  }

  return (
    <div className="pwa-install-prompt">
      <div className="pwa-install-content">
        <div className="pwa-install-icon">📱</div>
        <div className="pwa-install-text">
          <h3>Installer Géo Challenge</h3>
          <p>Installez l'application pour jouer hors-ligne et accéder rapidement au jeu !</p>
        </div>
        <div className="pwa-install-actions">
          <button 
            className="pwa-install-button"
            onClick={handleInstallClick}
          >
            Installer
          </button>
          <button 
            className="pwa-dismiss-button"
            onClick={handleDismiss}
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  )
}

export default PWAInstallPrompt

