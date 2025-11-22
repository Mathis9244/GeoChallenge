import React, { useState, useMemo } from 'react'
import './HintSystem.css'

const CATEGORY_NAMES = {
  small_area: 'Petite superficie',
  gdp: 'PIB global',
  capital_pop: 'Grande capitale',
  military: 'Taille de l\'armée',
  football: 'Football',
  eez: 'Taille ZEE',
  rice: 'Production de riz',
  francophones: 'Francophones'
}

const HINT_COST = 5 // Coût en points par indice
const MAX_HINTS = 3 // Limite d'indices par partie

function HintSystem({ countryData, availableCategories, assignments, onHintUsed }) {
  const [hintsUsed, setHintsUsed] = useState([])
  const [currentHint, setCurrentHint] = useState(null)
  const [showHint, setShowHint] = useState(false)

  // Générer les indices possibles basés sur les données du pays
  const possibleHints = useMemo(() => {
    if (!countryData || !countryData.ranks) return []

    const hints = []
    const ranks = countryData.ranks || {}

    // Pour chaque catégorie disponible, créer un indice
    availableCategories.forEach(category => {
      // Ne pas donner d'indice pour une catégorie déjà assignée
      if (assignments[category]) return

      const rank = ranks[category]
      if (rank === undefined || rank === null) return

      // Générer différents types d'indices selon la catégorie
      let hintText = ''
      let hintType = 'rank'

      if (rank <= 10) {
        hintText = `Ce pays est dans le top 10 pour "${CATEGORY_NAMES[category] || category}"`
        hintType = 'top10'
      } else if (rank <= 20) {
        hintText = `Ce pays est dans le top 20 pour "${CATEGORY_NAMES[category] || category}"`
        hintType = 'top20'
      } else if (rank <= 50) {
        hintText = `Ce pays est dans le top 50 pour "${CATEGORY_NAMES[category] || category}"`
        hintType = 'top50'
      } else if (rank <= 100) {
        hintText = `Ce pays est dans le top 100 pour "${CATEGORY_NAMES[category] || category}"`
        hintType = 'top100'
      } else {
        hintText = `Ce pays n'est pas dans le top 100 pour "${CATEGORY_NAMES[category] || category}"`
        hintType = 'low'
      }

      hints.push({
        category,
        text: hintText,
        type: hintType,
        rank
      })
    })

    // Trier par rang (meilleurs rangs en premier pour des indices plus utiles)
    return hints.sort((a, b) => a.rank - b.rank)
  }, [countryData, availableCategories, assignments])

  const canUseHint = hintsUsed.length < MAX_HINTS && possibleHints.length > 0
  const remainingHints = MAX_HINTS - hintsUsed.length

  const handleRequestHint = () => {
    if (!canUseHint) return

    // Trouver un indice qui n'a pas encore été utilisé
    const unusedHints = possibleHints.filter(
      hint => !hintsUsed.some(used => used.category === hint.category)
    )

    if (unusedHints.length === 0) return

    // Choisir l'indice le plus utile (meilleur rang)
    const selectedHint = unusedHints[0]

    // Ajouter à la liste des indices utilisés
    const newHintsUsed = [...hintsUsed, selectedHint]
    setHintsUsed(newHintsUsed)
    setCurrentHint(selectedHint)
    setShowHint(true)

    // Notifier le parent pour déduire les points
    if (onHintUsed) {
      onHintUsed(HINT_COST)
    }
  }

  const handleCloseHint = () => {
    setShowHint(false)
  }

  if (!countryData) return null

  return (
    <div className="hint-system">
      <div className="hint-controls">
        <button
          className={`hint-button ${!canUseHint ? 'disabled' : ''}`}
          onClick={handleRequestHint}
          disabled={!canUseHint}
          title={!canUseHint ? `Vous avez utilisé tous vos indices (${MAX_HINTS}/${MAX_HINTS})` : `Demander un indice (coût: +${HINT_COST} points, ${remainingHints} restants)`}
        >
          💡 Indice
          {remainingHints > 0 && (
            <span className="hint-remaining">{remainingHints}</span>
          )}
        </button>
        <div className="hint-info">
          <span className="hint-cost">+{HINT_COST} pts par indice</span>
          <span className="hint-limit">{hintsUsed.length}/{MAX_HINTS} utilisés</span>
        </div>
      </div>

      {hintsUsed.length > 0 && (
        <div className="hints-used">
          <h4>Indices utilisés :</h4>
          <div className="hints-list">
            {hintsUsed.map((hint, index) => (
              <div key={index} className="hint-item">
                <span className="hint-icon">💡</span>
                <span className="hint-text">{hint.text}</span>
                <span className="hint-cost-badge">+{HINT_COST} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showHint && currentHint && (
        <div className="hint-popup-overlay" onClick={handleCloseHint}>
          <div className="hint-popup" onClick={(e) => e.stopPropagation()}>
            <button className="hint-popup-close" onClick={handleCloseHint}>×</button>
            <div className="hint-popup-icon">💡</div>
            <h3>Nouvel indice !</h3>
            <p className="hint-popup-text">{currentHint.text}</p>
            <div className="hint-popup-cost">
              Coût : +{HINT_COST} points ajoutés à votre score
            </div>
            <button className="hint-popup-button" onClick={handleCloseHint}>
              Compris
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default HintSystem

