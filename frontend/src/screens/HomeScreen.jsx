import React, { useState, useEffect } from 'react'
import { getSettings } from '../utils/storage'
import './HomeScreen.css'

function HomeScreen({ onStart, personalBest, onShowLeaderboard, onShowStats, onShowSettings }) {
  const [settings, setSettings] = useState(getSettings())
  
  useEffect(() => {
    // Écouter les mises à jour des paramètres
    const handleSettingsUpdate = (event) => {
      // Utiliser les paramètres de l'événement ou recharger depuis le localStorage
      const newSettings = event?.detail || getSettings()
      setSettings(newSettings)
    }
    
    window.addEventListener('settingsUpdated', handleSettingsUpdate)
    
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate)
    }
  }, [])
  
  const difficulty = settings.difficulty || 'normal'
  
  const difficultyNames = {
    easy: '🌱 Facile',
    normal: '⭐ Normal',
    hard: '🔥 Difficile',
    expert: '💀 Expert'
  }
  
  const difficultyInfo = {
    easy: '6 catégories, 6 pays',
    normal: '8 catégories, 8 pays',
    hard: '10 pays',
    expert: '12 pays'
  }
  return (
    <div className="home-screen">
      <div className="home-card">
        <h1 className="title">🌍 Géo Challenge</h1>
        <p className="subtitle">Testez vos connaissances géographiques !</p>
        
        {personalBest !== null && (
          <div className="personal-best">
            <div className="pb-label">Meilleur score</div>
            <div className="pb-value">{personalBest} points</div>
          </div>
        )}
        
        <div className="difficulty-indicator">
          <span className="difficulty-label">Mode actuel :</span>
          <span className="difficulty-badge">{difficultyNames[difficulty]}</span>
          <span className="difficulty-info">({difficultyInfo[difficulty]})</span>
        </div>
        
        <div className="rules">
          <h2>Règles du jeu</h2>
          <ul>
            <li>8 pays vous seront présentés un par un</li>
            <li>Placez chaque pays dans une catégorie libre</li>
            <li>Vous gagnez des points = rang mondial du pays dans cette catégorie</li>
            <li>Objectif : obtenir le score total le plus petit possible</li>
          </ul>
        </div>

        <div className="home-actions">
          <button className="play-button" onClick={onStart}>
            Jouer
          </button>
          <div className="home-secondary-actions">
            <button className="secondary-button" onClick={onShowLeaderboard}>
              🏆 Classement
            </button>
            <button className="secondary-button" onClick={onShowStats}>
              📊 Statistiques
            </button>
            <button className="secondary-button" onClick={onShowSettings}>
              ⚙️ Paramètres
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeScreen

