import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Le service worker est automatiquement enregistré par vite-plugin-pwa
let updateSW
if ('serviceWorker' in navigator) {
  import('virtual:pwa-register').then(({ registerSW }) => {
    updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        // Nouvelle version disponible
        if (confirm('Une nouvelle version est disponible. Recharger la page ?')) {
          updateSW(true)
        }
      },
      onOfflineReady() {
        console.log('✅ Application prête pour le mode hors-ligne')
      },
      onRegistered(registration) {
        console.log('✅ Service Worker enregistré:', registration?.scope)
      },
      onRegisterError(error) {
        console.error('❌ Erreur lors de l\'enregistrement du Service Worker:', error)
      }
    })
  }).catch(() => {
    console.warn('Service Worker non disponible (mode développement peut-être)')
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

