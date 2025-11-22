import React from 'react'
import './GameScreen.css'

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

function GameScreen({ gameData, snapshot, onCategorySelect }) {
  const { countries, currentIndex, assignments, score } = gameData
  const currentCountry = countries[currentIndex]
  const countryData = snapshot.countries[currentCountry] || {}
  
  const progress = ((currentIndex + 1) / 8) * 100

  return (
    <div className="game-screen">
      <div className="game-header">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="score">Score actuel: {score}</div>
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

