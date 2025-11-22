import React, { useState } from 'react'
import { saveSettings, getSettings, resetTutorial } from '../utils/storage'
import './SettingsScreen.css'

function SettingsScreen({ settings: initialSettings, onBack }) {
  const defaultSettings = getSettings()
  // S'assurer que difficulty est toujours défini
  if (!defaultSettings.difficulty) {
    defaultSettings.difficulty = 'normal'
  }
  // S'assurer que initialSettings a aussi difficulty
  if (initialSettings && !initialSettings.difficulty) {
    initialSettings.difficulty = 'normal'
  }
  const [settings, setSettings] = useState(() => {
    const s = initialSettings || defaultSettings
    // S'assurer que difficulty est défini
    if (!s.difficulty) {
      s.difficulty = 'normal'
    }
    return s
  })
  const [saved, setSaved] = useState(false)

  const handleChange = (key, value) => {
    const newSettings = { ...settings, [key]: value }
    console.log('handleChange called:', key, value, 'Current settings:', settings, 'New settings:', newSettings)
    setSettings(newSettings)
    setSaved(false)
  }
  
  const handleDifficultyChange = (difficulty) => {
    console.log('handleDifficultyChange called with:', difficulty, 'Current settings:', settings)
    // Mettre à jour les deux valeurs en une seule fois pour éviter les problèmes de state
    const newSettings = {
      ...settings,
      difficulty: difficulty,
      selectedCategories: null // Réinitialiser la sélection manuelle
    }
    console.log('New settings to set:', newSettings)
    setSettings(newSettings)
    setSaved(false)
  }

  const handleSave = () => {
    // S'assurer que difficulty est défini avant de sauvegarder
    // En mode easy/normal, s'assurer que selectedCategories est null
    let settingsToSave = {
      ...settings,
      difficulty: settings.difficulty || 'normal'
    }
    
    // En mode easy/normal, forcer selectedCategories à null
    if (settingsToSave.difficulty === 'easy' || settingsToSave.difficulty === 'normal') {
      settingsToSave.selectedCategories = null
      console.log('Resetting selectedCategories for', settingsToSave.difficulty, 'mode')
    }
    
    console.log('Saving settings:', settingsToSave)
    saveSettings(settingsToSave)
    setSettings(settingsToSave) // Mettre à jour le state local aussi
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    
    // Appliquer le thème immédiatement
    if (settingsToSave.theme) {
      document.documentElement.setAttribute('data-theme', settingsToSave.theme)
    }
    
    // Notifier le parent que les paramètres ont changé
    // Cela permettra de recharger les paramètres dans App.jsx
    window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: settingsToSave }))
  }

  const CATEGORIES = [
    { id: 'small_area', name: 'Petite superficie', emoji: '📏' },
    { id: 'gdp', name: 'PIB global', emoji: '💰' },
    { id: 'capital_pop', name: 'Grande capitale', emoji: '🏙️' },
    { id: 'military', name: 'Taille de l\'armée', emoji: '⚔️' },
    { id: 'football', name: 'Football', emoji: '⚽' },
    { id: 'eez', name: 'Taille ZEE', emoji: '🌊' },
    { id: 'rice', name: 'Production de riz', emoji: '🌾' },
    { id: 'francophones', name: 'Francophones', emoji: '🗣️' }
  ]

  // Déterminer les catégories sélectionnées selon le mode
  const getDefaultCategories = () => {
    const difficulty = settings.difficulty || 'normal'
    if (difficulty === 'easy') {
      return CATEGORIES.slice(0, 6).map(c => c.id)
    }
    return CATEGORIES.map(c => c.id)
  }
  
  const selectedCategories = settings.selectedCategories || getDefaultCategories()
  const isDifficultyMode = ['easy', 'normal'].includes(settings.difficulty || 'normal')
  const isCustomMode = settings.selectedCategories && settings.selectedCategories.length > 0

  const toggleCategory = (categoryId) => {
    // Si on est en mode difficulté (easy/normal), activer le mode personnalisé
    if (isDifficultyMode && !isCustomMode) {
      // Commencer avec toutes les catégories
      handleChange('selectedCategories', CATEGORIES.map(c => c.id))
      return
    }
    
    if (selectedCategories.includes(categoryId)) {
      if (selectedCategories.length > 4) { // Minimum 4 catégories
        handleChange('selectedCategories', selectedCategories.filter(id => id !== categoryId))
      }
    } else {
      handleChange('selectedCategories', [...selectedCategories, categoryId])
    }
  }

  return (
    <div className="settings-screen">
      <div className="settings-card">
        <div className="settings-header">
          <h1 className="settings-title">⚙️ Paramètres</h1>
          <button className="back-button" onClick={onBack}>
            ← Retour
          </button>
        </div>

        {/* Thème */}
        <div className="settings-section">
          <h2>Apparence</h2>
          <div className="setting-item">
            <label className="setting-label">Thème</label>
            <div className="theme-options">
              <button
                className={`theme-button ${settings.theme === 'light' ? 'active' : ''}`}
                onClick={() => handleChange('theme', 'light')}
              >
                ☀️ Clair
              </button>
              <button
                className={`theme-button ${settings.theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleChange('theme', 'dark')}
              >
                🌙 Sombre
              </button>
            </div>
          </div>
        </div>

        {/* Mode de difficulté */}
        <div className="settings-section">
          <h2>Mode de difficulté</h2>
          <p className="setting-hint">Choisissez le niveau de difficulté qui vous convient</p>
          <div className="difficulty-options">
            <button
              type="button"
              className={`difficulty-button ${(settings.difficulty || 'normal') === 'easy' ? 'active' : ''}`}
              onClick={() => handleDifficultyChange('easy')}
            >
              <div className="difficulty-icon">🌱</div>
              <div className="difficulty-name">Facile</div>
              <div className="difficulty-desc">6 catégories, 6 pays</div>
            </button>
            <button
              type="button"
              className={`difficulty-button ${(settings.difficulty || 'normal') === 'normal' ? 'active' : ''}`}
              onClick={() => handleDifficultyChange('normal')}
            >
              <div className="difficulty-icon">⭐</div>
              <div className="difficulty-name">Normal</div>
              <div className="difficulty-desc">8 catégories, 8 pays</div>
            </button>
            <button
              type="button"
              className={`difficulty-button ${(settings.difficulty || 'normal') === 'hard' ? 'active' : ''}`}
              onClick={() => handleDifficultyChange('hard')}
            >
              <div className="difficulty-icon">🔥</div>
              <div className="difficulty-name">Difficile</div>
              <div className="difficulty-desc">10 pays</div>
            </button>
            <button
              type="button"
              className={`difficulty-button ${(settings.difficulty || 'normal') === 'expert' ? 'active' : ''}`}
              onClick={() => handleDifficultyChange('expert')}
            >
              <div className="difficulty-icon">💀</div>
              <div className="difficulty-name">Expert</div>
              <div className="difficulty-desc">12 pays</div>
            </button>
          </div>
        </div>

        {/* Catégories */}
        <div className="settings-section">
          <h2>Catégories personnalisées ({selectedCategories.length}/8)</h2>
          <p className="setting-hint">
            {settings.difficulty === 'easy' && 'Mode Facile : 6 catégories sélectionnées automatiquement'}
            {settings.difficulty === 'normal' && 'Mode Normal : 8 catégories sélectionnées automatiquement'}
            {settings.difficulty === 'hard' && 'Mode Difficile : Personnalisez les catégories (minimum 4)'}
            {settings.difficulty === 'expert' && 'Mode Expert : Personnalisez les catégories (minimum 4)'}
            {!settings.difficulty && 'Choisissez les catégories à jouer (minimum 4)'}
          </p>
          <p className="setting-hint" style={{ fontSize: '0.85rem', color: '#999', marginTop: '5px' }}>
            {['easy', 'normal'].includes(settings.difficulty) && '⚠️ La sélection manuelle désactivera le mode de difficulté'}
          </p>
          <div className="categories-selection">
            {CATEGORIES.map(category => {
              const isSelected = selectedCategories.includes(category.id)
              const isDisabled = !isSelected && selectedCategories.length <= 4
              const isLocked = isDifficultyMode && !isCustomMode
              
              return (
                <button
                  key={category.id}
                  className={`category-select-button ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''} ${isLocked ? 'locked' : ''}`}
                  onClick={() => toggleCategory(category.id)}
                  disabled={isDisabled && !isLocked}
                  title={isLocked ? 'Activez la sélection manuelle pour modifier' : ''}
                >
                  <span className="category-select-emoji">{category.emoji}</span>
                  <span className="category-select-name">{category.name}</span>
                  {isLocked && <span className="category-lock-icon">🔒</span>}
                </button>
              )
            })}
          </div>
        </div>

        {/* Timer */}
        <div className="settings-section">
          <h2>Mode chrono</h2>
          <div className="setting-item">
            <label className="setting-checkbox">
              <input
                type="checkbox"
                checked={settings.timerEnabled || false}
                onChange={(e) => handleChange('timerEnabled', e.target.checked)}
              />
              <span>Activer le chronomètre</span>
            </label>
          </div>
          {settings.timerEnabled && (
            <div className="setting-item">
              <label className="setting-label">
                Durée par pays : {settings.timerDuration || 60} secondes
              </label>
              <input
                type="range"
                min="30"
                max="120"
                step="10"
                value={settings.timerDuration || 60}
                onChange={(e) => handleChange('timerDuration', parseInt(e.target.value))}
                className="timer-slider"
              />
              <div className="slider-labels">
                <span>30s</span>
                <span>120s</span>
              </div>
            </div>
          )}
        </div>

        {/* Autres options */}
        <div className="settings-section">
          <h2>Options de jeu</h2>
          <div className="setting-item">
            <label className="setting-checkbox">
              <input
                type="checkbox"
                checked={settings.hintsEnabled !== false}
                onChange={(e) => handleChange('hintsEnabled', e.target.checked)}
              />
              <span>Activer les indices</span>
            </label>
          </div>
          <div className="setting-item">
            <label className="setting-checkbox">
              <input
                type="checkbox"
                checked={settings.soundEnabled !== false}
                onChange={(e) => handleChange('soundEnabled', e.target.checked)}
              />
              <span>Activer les sons</span>
            </label>
          </div>
        </div>

        {/* Bouton sauvegarder */}
        <div className="settings-actions">
          <button 
            className={`save-button ${saved ? 'saved' : ''}`}
            onClick={handleSave}
          >
            {saved ? '✓ Sauvegardé' : '💾 Sauvegarder'}
          </button>
        </div>
        
        {/* Option pour refaire le tutoriel */}
        <div className="settings-section">
          <h2>Autres options</h2>
          <div className="setting-item">
            <button
              className="tutorial-reset-button"
              onClick={() => {
                if (window.confirm('Voulez-vous refaire le tutoriel ?')) {
                  resetTutorial()
                  window.location.reload()
                }
              }}
            >
              📚 Refaire le tutoriel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsScreen

