import React, { useState } from 'react'
import ShareModal from '../components/ShareModal'
import Confetti from '../components/Confetti'
import './ResultsScreen.css'

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

function ResultsScreen({ gameData, snapshot, personalBest, isNewRecord, onReplay, onShowLeaderboard }) {
  const { results, score, duration } = gameData
  const [showShareModal, setShowShareModal] = useState(false)
  
  // Calculer le score optimal (minimal), maximal et minimal théoriques
  const scoreAnalysis = React.useMemo(() => {
    if (!snapshot || !gameData.countries) return null
    
    const countries = gameData.countries
    const availableCategories = gameData.availableCategories || 
      ['small_area', 'gdp', 'capital_pop', 'military', 'football', 'eez', 'rice', 'francophones']
    const categories = availableCategories
    
    // Score optimal (minimal) - meilleur placement possible
    const optimalAssignments = {}
    const usedCategoriesOptimal = new Set()
    
    countries.forEach(country => {
      const countryData = snapshot.countries[country]
      if (!countryData) return
      
      let bestCategory = null
      let bestRank = Infinity
      
      categories.forEach(category => {
        if (!usedCategoriesOptimal.has(category)) {
          const rank = countryData.ranks[category] || 196
          if (rank < bestRank) {
            bestRank = rank
            bestCategory = category
          }
        }
      })
      
      if (bestCategory) {
        optimalAssignments[country] = { category: bestCategory, rank: bestRank }
        usedCategoriesOptimal.add(bestCategory)
      }
    })
    
    const optimal = Object.values(optimalAssignments).reduce((sum, item) => sum + item.rank, 0)
    
    // Score maximal (pire placement possible)
    const worstAssignments = {}
    const usedCategoriesWorst = new Set()
    
    // Trier les pays par ordre de difficulté (pays avec les meilleurs rangs en moyenne d'abord)
    const countriesWithData = countries.map(country => {
      const countryData = snapshot.countries[country]
      if (!countryData) return null
      const avgRank = categories.reduce((sum, cat) => sum + (countryData.ranks[cat] || 196), 0) / categories.length
      return { country, avgRank, data: countryData }
    }).filter(Boolean).sort((a, b) => a.avgRank - b.avgRank)
    
    // Pour chaque pays, trouver sa pire catégorie disponible
    countriesWithData.forEach(({ country, data: countryData }) => {
      let worstCategory = null
      let worstRank = -1
      
      categories.forEach(category => {
        if (!usedCategoriesWorst.has(category)) {
          const rank = countryData.ranks[category] || 196
          if (rank > worstRank) {
            worstRank = rank
            worstCategory = category
          }
        }
      })
      
      if (worstCategory) {
        worstAssignments[country] = { category: worstCategory, rank: worstRank }
        usedCategoriesWorst.add(worstCategory)
      }
    })
    
    const worst = Object.values(worstAssignments).reduce((sum, item) => sum + item.rank, 0)
    
    // Score minimal absolu (somme des meilleurs rangs de chaque pays, sans contrainte de catégorie unique)
    const allBestRanks = countries.map(country => {
      const countryData = snapshot.countries[country]
      if (!countryData) return 196
      const ranks = categories.map(cat => countryData.ranks[cat] || 196)
      return Math.min(...ranks)
    })
    const absoluteMin = allBestRanks.reduce((sum, rank) => sum + rank, 0)
    
    return {
      optimal, // Score optimal avec contraintes (1 pays par catégorie)
      worst,   // Score maximal (pire placement)
      absoluteMin // Score minimal absolu (sans contraintes)
    }
  }, [snapshot, gameData])
  
  const optimalScore = scoreAnalysis?.optimal
  const worstScore = scoreAnalysis?.worst
  const absoluteMinScore = scoreAnalysis?.absoluteMin
  const efficiency = optimalScore ? Math.round((optimalScore / score) * 100) : null
  
  const getScoreColor = (score) => {
    if (score <= 50) return '#4caf50' // Excellent
    if (score <= 100) return '#ff9800' // Bon
    return '#f44336' // À améliorer
  }

  const getScoreMessage = (score) => {
    if (score <= 50) return 'Excellent ! 🎉'
    if (score <= 100) return 'Bon score ! 👍'
    return 'Peut mieux faire ! 💪'
  }

  return (
    <div className="results-screen">
      <Confetti trigger={isNewRecord} />
      <div className="results-card">
        <h1 className="results-title">Résultats</h1>
        
        <div className="final-score" style={{ color: getScoreColor(score) }}>
          {isNewRecord && (
            <div className="new-record-badge">
              🏆 Nouveau record personnel !
            </div>
          )}
          <div className="score-value">{score}</div>
          <div className="score-label">points</div>
          <div className="score-message">{getScoreMessage(score)}</div>
          {personalBest !== null && (
            <div className="personal-best-display">
              <span className="pb-label">Meilleur score: </span>
              <span className="pb-value">{personalBest} points</span>
            </div>
          )}
          {scoreAnalysis && (
            <div className="score-analysis">
              <div className="score-analysis-title">📊 Analyse des scores possibles</div>
              <div className="score-analysis-grid">
                <div className="score-analysis-item">
                  <div className="score-analysis-label">Score minimal</div>
                  <div className="score-analysis-value score-min">{absoluteMinScore} pts</div>
                  <div className="score-analysis-desc">Meilleur possible (sans contraintes)</div>
                </div>
                <div className="score-analysis-item">
                  <div className="score-analysis-label">Score optimal</div>
                  <div className="score-analysis-value score-optimal">{optimalScore} pts</div>
                  <div className="score-analysis-desc">Meilleur possible (avec contraintes)</div>
                </div>
                <div className="score-analysis-item">
                  <div className="score-analysis-label">Votre score</div>
                  <div className="score-analysis-value score-current" style={{ color: getScoreColor(score) }}>{score} pts</div>
                  <div className="score-analysis-desc">
                    {efficiency && `Efficacité: ${efficiency}%`}
                  </div>
                </div>
                <div className="score-analysis-item">
                  <div className="score-analysis-label">Score maximal</div>
                  <div className="score-analysis-value score-max">{worstScore} pts</div>
                  <div className="score-analysis-desc">Pire possible</div>
                </div>
              </div>
            </div>
          )}
          {duration && (
            <div className="duration-display">
              ⏱️ Temps: {Math.round(duration / 1000)}s
            </div>
          )}
        </div>

        <div className="results-table">
          <h2>Détail des placements</h2>
          <table>
            <thead>
              <tr>
                <th>Catégorie</th>
                <th>Pays</th>
                <th>Rang</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td>
                    <span className="category-cell">
                      {CATEGORY_NAMES[result.category] || result.category}
                    </span>
                  </td>
                  <td>
                    <span className="country-cell">
                      <img 
                        src={result.flag || 'https://flagcdn.com/w40/xx.png'} 
                        alt={`Drapeau ${result.countryName}`}
                        className="flag-emoji"
                        onError={(e) => {
                          e.target.src = 'https://flagcdn.com/w40/xx.png'
                        }}
                      />
                      <span className="country-name">{result.countryName}</span>
                    </span>
                  </td>
                  <td className="rank-cell">{result.rank}</td>
                  <td className="points-cell">+{result.rank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="results-actions">
          <button className="replay-button" onClick={onReplay}>
            Rejouer
          </button>
          <button 
            className="leaderboard-button-results" 
            onClick={onShowLeaderboard}
          >
            🏆 Classement
          </button>
          <button 
            className="share-button" 
            onClick={() => setShowShareModal(true)}
          >
            Partager
          </button>
        </div>
      </div>
      
      {showShareModal && (
        <ShareModal
          gameData={gameData}
          score={score}
          personalBest={personalBest}
          isNewRecord={isNewRecord}
          optimalScore={optimalScore}
          efficiency={efficiency}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  )
}

export default ResultsScreen

