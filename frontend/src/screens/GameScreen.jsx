import React, { useState, useEffect } from 'react'
import HintSystem from '../components/HintSystem'
import './GameScreen.css'

const ALL_CATEGORIES = [
  { id: 'small_area', name: 'Petite superficie', emoji: '📏' },
  { id: 'gdp', name: 'PIB global', emoji: '💰' },
  { id: 'capital_pop', name: 'Grande capitale', emoji: '🏙️' },
  { id: 'military', name: 'Taille de l\'armée', emoji: '⚔️' },
  { id: 'football', name: 'Football', emoji: '⚽' },
  { id: 'eez', name: 'Taille ZEE', emoji: '🌊' },
  { id: 'rice', name: 'Production de riz', emoji: '🌾' },
  { id: 'francophones', name: 'Francophones', emoji: '🗣️' }
]

function GameScreen({ gameData, snapshot, onCategorySelect, onHintUsed, onUndo }) {
  const { countries, currentIndex, assignments, score, timerEnabled, timeRemaining, availableCategories, hintsUsed = [], history = [], undoCount = 0, maxUndos = 3 } = gameData
  const currentCountry = countries[currentIndex]
  const countryData = snapshot.countries[currentCountry] || {}
  
  // Filtrer les catégories disponibles
  const CATEGORIES = availableCategories 
    ? ALL_CATEGORIES.filter(cat => availableCategories.includes(cat.id))
    : ALL_CATEGORIES
  
  const totalCountries = countries.length
  const progress = ((currentIndex + 1) / totalCountries) * 100
  const [timer, setTimer] = useState(timeRemaining)
  
  // Réinitialiser le timer quand on change de pays
  useEffect(() => {
    if (timerEnabled && timeRemaining !== null && timeRemaining !== undefined) {
      setTimer(timeRemaining)
    } else if (!timerEnabled) {
      setTimer(null)
    }
  }, [currentIndex, timerEnabled, timeRemaining])
  
  // Gestion du timer
  useEffect(() => {
    if (!timerEnabled || timer === null || timer === undefined) {
      return
    }
    
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev === null || prev === undefined || prev <= 1) {
          // Temps écoulé - sélectionner automatiquement la première catégorie disponible
          const availableCategory = CATEGORIES.find(cat => !assignments[cat.id])
          if (availableCategory) {
            setTimeout(() => onCategorySelect(availableCategory.id), 100)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [timerEnabled, timer, assignments, onCategorySelect, currentIndex, CATEGORIES])

  return (
    <div className="game-screen">
      <div className="game-header">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="header-info">
          <div className="score">Score actuel: {score}</div>
          <div className="header-actions">
            {onUndo && history.length > 0 && undoCount < maxUndos && (
              <button 
                className="undo-button"
                onClick={onUndo}
                title={`Annuler le dernier placement (${undoCount}/${maxUndos} utilisés)`}
              >
                ↶ Annuler
              </button>
            )}
            {timerEnabled && timer !== null && (
              <div className={`timer ${timer <= 10 ? 'timer-warning' : ''}`}>
                ⏱️ {timer}s
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="current-country">
        <div className="country-flag">
          <img 
            src={countryData.flag || 'https://flagcdn.com/w80/xx.png'} 
            alt={`Drapeau ${countryData.name || currentCountry}`}
            className="flag-image"
            onError={(e) => {
              e.target.src = 'https://flagcdn.com/w80/xx.png'
            }}
          />
        </div>
        <h2>
          <img 
            src={countryData.flag || 'https://flagcdn.com/w80/xx.png'} 
            alt=""
            className="country-flag-inline"
            onError={(e) => {
              e.target.src = 'https://flagcdn.com/w80/xx.png'
            }}
          />
          {countryData.name || currentCountry}
        </h2>
        <p className="country-hint">Placez ce pays dans une catégorie</p>
      </div>

      {onHintUsed && (
        <HintSystem
          countryData={countryData}
          availableCategories={availableCategories}
          assignments={assignments}
          onHintUsed={onHintUsed}
        />
      )}

      <div className="categories-grid">
        {CATEGORIES.map(category => {
          const isAssigned = assignments[category.id]
          const assignedCountry = isAssigned ? snapshot.countries[isAssigned] : null
          const assignedRank = isAssigned ? assignedCountry?.ranks[category.id] : null

          return (
            <button
              key={category.id}
              className={`category-card ${isAssigned ? 'assigned' : 'available'}`}
              onClick={() => !isAssigned && onCategorySelect(category.id)}
              disabled={!!isAssigned}
            >
              <div className="category-emoji">{category.emoji}</div>
              <div className="category-name">{category.name}</div>
              {isAssigned && (
                <div className="assigned-info">
                  <div className="assigned-flag">
                    <img 
                      src={assignedCountry?.flag || 'https://flagcdn.com/w40/xx.png'} 
                      alt={`Drapeau ${assignedCountry?.name || isAssigned}`}
                      className="flag-image-small"
                      onError={(e) => {
                        e.target.src = 'https://flagcdn.com/w40/xx.png'
                      }}
                    />
                  </div>
                  <div className="assigned-name">
                    <img 
                      src={assignedCountry?.flag || 'https://flagcdn.com/w20/xx.png'} 
                      alt=""
                      className="flag-inline"
                      onError={(e) => {
                        e.target.src = 'https://flagcdn.com/w20/xx.png'
                      }}
                    />
                    {assignedCountry?.name || isAssigned}
                  </div>
                  <div className="assigned-rank">+{assignedRank} pts</div>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default GameScreen

